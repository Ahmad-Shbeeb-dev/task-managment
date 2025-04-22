import { faker } from "@faker-js/faker";
import {
  Prisma,
  PrismaClient,
  Role,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const ADMIN_PASSWORD = "asddsa";
const TASK_COUNT = 20;

async function main() {
  let admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    admin = await prisma.user.create({
      data: {
        email: "admin@test.com",
        name: "admin",
        role: "ADMIN",
        Accounts: {
          create: {
            password: hashedPassword,
            provider: "credentials",
            type: "credentials",
          },
        },
      },
    });
    console.log("Created Super Admin with ID:", admin.id);
    console.log("Admin email:", admin.email);
    console.log("Admin password:", ADMIN_PASSWORD);
  } else {
    console.log("Found Super Admin with ID:", admin.id);
  }

  const adminId = admin.id;
  const audit = { createdBy: adminId, updatedBy: adminId };

  await prisma.passwordReset.deleteMany({
    where: {
      OR: [
        { User: { email: { in: ["user@test.com"] } } },
        { User: { id: { notIn: [adminId] } } },
      ],
    },
  });
  await prisma.task.deleteMany({
    where: {
      assignedTo: { email: "user@test.com" },
    },
  });
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: { in: ["user@test.com"] } }, { id: { notIn: [adminId] } }],
    },
  });

  //seed User table
  const hashedPassword = await bcrypt.hash("asddsa", 10);

  const testUsers = [
    { name: "User", email: "user@test.com", role: "USER" as Role },
  ];
  const testUser = await prisma.$transaction(
    testUsers.map((user) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          Accounts: {
            create: {
              password: hashedPassword,
              provider: "credentials",
              type: "credentials",
              providerAccountId: user.email,
              ...audit,
            },
          },
          ...audit,
        },
        // select: { id: true },
      }),
    ),
  );
  console.log(">>>> User Seeded");

  // Find the user with email "user@test.com"
  const userForTasks = testUser.find((user) => user.email === "user@test.com");

  if (userForTasks) {
    // Explicitly type tasksData
    const tasksData: Prisma.TaskCreateManyInput[] = [];
    const taskPriorities: TaskPriority[] = [
      TaskPriority.LOW,
      TaskPriority.MEDIUM,
      TaskPriority.HIGH,
    ];
    const taskStatuses: TaskStatus[] = [
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    for (let i = 0; i < TASK_COUNT; i++) {
      tasksData.push({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        // Cast to enum type
        priority: faker.helpers.arrayElement(taskPriorities),
        // Cast to enum type
        status: faker.helpers.arrayElement(taskStatuses),
        assignedToId: userForTasks.id,
        dueDate: faker.date.future(),
      });
    }

    await prisma.task.createMany({
      data: tasksData,
    });
    console.log(
      `>>>> Seeded ${TASK_COUNT} tasks for user ${userForTasks.email}`,
    );
  } else {
    console.log("User user@test.com not found, skipping task seeding.");
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
