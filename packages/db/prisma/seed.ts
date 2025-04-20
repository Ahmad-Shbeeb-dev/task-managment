import { faker } from "@faker-js/faker";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Function to reset admin password - can be called manually when needed
export async function resetAdminPassword() {
  console.log("Resetting admin password...");
  const admin = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
    include: { Accounts: true },
  });

  if (!admin) {
    console.log("Admin user not found");
    return;
  }

  const hashedPassword = await bcrypt.hash("asddsa", 10);

  if (admin.Accounts.length > 0) {
    await prisma.account.update({
      where: { id: admin.Accounts[0].id },
      data: {
        password: hashedPassword,
        failedSignins: 0,
      },
    });
    console.log("Admin password has been reset to 'asddsa'");
  } else {
    console.log("Admin account not found");
  }
}

async function main() {
  let admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: "admin",
        role: "ADMIN",
      },
    });
    console.log("Created Super Admin with ID:", admin.id);
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
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: { in: ["user@test.com"] } }, { id: { notIn: [adminId] } }],
    },
  });

  //seed Employee table
  const hashedPassword = await bcrypt.hash("asddsa", 10);

  const testUsers = [
    { name: "Admin", email: "admin@test.com", role: "ADMIN" as Role },
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
  console.log(">>>> Employee Seeded");
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
