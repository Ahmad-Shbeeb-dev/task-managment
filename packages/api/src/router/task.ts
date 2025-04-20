// Corrected import path for Prisma generated types/enums
// Import necessary types/enums from Prisma Client
import type { Prisma } from "@prisma/client";
// Corrected import paths for internal packages
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { RecurringType, TaskStatus } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createTaskInputSchema,
  getTasksInputSchema,
  updateTaskInputSchema,
} from "../validations/task";

// Helper function to calculate the next occurrence date
const calculateNextOccurrence = (
  startDate: Date,
  type: RecurringType,
): Date => {
  const nextDate = new Date(startDate);
  switch (type) {
    case "DAILY":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "WEEKLY":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }
  return nextDate;
};

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTaskInputSchema) // Access via nested router object if exported that way
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const userRole = session.user.role;

      // Check if the task is being assigned to someone else
      if (input.assignedToId && input.assignedToId !== userId) {
        // If assigning to someone else, user MUST be an ADMIN
        if (userRole !== "ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You do not have permission to assign tasks to other users.",
          });
        }
      }

      // If assignedToId is not provided, default to the user creating the task
      const assignedToId = input.assignedToId ?? userId;

      let nextOccurrence: Date | undefined | null = null;
      if (input.isRecurring) {
        if (!input.recurringType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Recurring type is required for recurring tasks.",
          });
        }
        if (!input.dueDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Due date is required for recurring tasks to calculate next occurrence.",
          });
        }
        nextOccurrence = calculateNextOccurrence(
          input.dueDate,
          input.recurringType,
        );
      }

      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          assignedToId: assignedToId,
          nextOccurrence: nextOccurrence,
          // createdById: userId, // Add if audit fields are used
        },
      });
      return task;
    }),

  getAll: protectedProcedure
    .input(getTasksInputSchema) // Use aliased definition input
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const userRole = session.user.role; // Get user role
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      // Define the base query conditions
      const whereCondition: Prisma.TaskWhereInput = {};

      // If the user is not an admin, only fetch tasks assigned to them
      if (userRole !== "ADMIN") {
        whereCondition.assignedToId = userId;
      }

      // Admins will not have the assignedToId filter applied,
      // thus fetching all tasks.

      const tasks = await ctx.prisma.task.findMany({
        take: limit + 1,
        where: whereCondition, // Apply the dynamic where condition
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (tasks.length > limit) {
        const nextItem = tasks.pop();
        nextCursor = nextItem!.id;
      }

      return {
        tasks,
        nextCursor,
      };
    }),

  update: protectedProcedure
    .input(updateTaskInputSchema) // Use aliased definition input
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const { id, ...dataToUpdate } = input;

      const task = await ctx.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found." });
      }

      // Allow update if user is the assignee OR if the user is an ADMIN
      if (task.assignedToId !== userId && session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You can only update tasks assigned to you or if you are an admin.",
        });
      }

      let nextOccurrence: Date | null = task.nextOccurrence;
      const currentDueDate =
        dataToUpdate.dueDate === null
          ? null
          : dataToUpdate.dueDate ?? task.dueDate;
      const currentIsRecurring = dataToUpdate.isRecurring ?? task.isRecurring;
      // Handle null specifically for recurringType update
      const currentRecurringType =
        dataToUpdate.recurringType === null
          ? null
          : dataToUpdate.recurringType ?? task.recurringType;

      if (currentIsRecurring) {
        if (!currentRecurringType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Recurring type is required for recurring tasks.",
          });
        }
        if (!currentDueDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Due date is required for recurring tasks.",
          });
        }
        // Recalculate only if relevant fields actually changed or isRecurring became true
        if (
          dataToUpdate.dueDate !== undefined ||
          dataToUpdate.recurringType !== undefined ||
          dataToUpdate.isRecurring === true
        ) {
          nextOccurrence = calculateNextOccurrence(
            currentDueDate,
            currentRecurringType,
          );
        }
      } else if (dataToUpdate.isRecurring === false) {
        nextOccurrence = null;
        // Ensure recurringType is explicitly set to null if isRecurring is false
        dataToUpdate.recurringType = null;
      }

      const updatedTask = await ctx.prisma.task.update({
        where: { id },
        data: {
          ...dataToUpdate,
          recurringType: dataToUpdate.recurringType, // Ensure this is included in the update data
          nextOccurrence: nextOccurrence,
          // updatedById: userId, // Add if audit fields are used
        },
      });
      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() })) // Use aliased definition input
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const { id } = input;

      const task = await ctx.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found." });
      }

      // Allow delete if user is the assignee OR if the user is an ADMIN
      if (task.assignedToId !== userId && session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You can only delete tasks assigned to you or if you are an admin.",
        });
      }

      await ctx.prisma.task.delete({ where: { id } });
      return { success: true };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const userId = session.user.id;
    const userRole = session.user.role; // Get user role

    // Define the base query conditions for stats
    const whereCondition: Prisma.TaskWhereInput = {};

    // If the user is not an admin, only consider tasks assigned to them
    if (userRole !== "ADMIN") {
      whereCondition.assignedToId = userId;
    }
    // Admins will have an empty where condition here for statusCounts,
    // considering all tasks.

    const statusCounts = await ctx.prisma.task.groupBy({
      by: ["status"],
      // where: { assignedToId: userId }, // Original code
      where: whereCondition, // Apply dynamic condition
      _count: { status: true },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Prisma groupBy on MongoDB doesn't support grouping by date parts directly.
    // Fetch raw data and aggregate in code.
    const completedTasksRaw = await ctx.prisma.task.findMany({
      // where: { // Original code
      //   assignedToId: userId,
      //   status: "DONE",
      //   updatedAt: { gte: sevenDaysAgo },
      // },
      where: {
        ...whereCondition, // Apply dynamic condition here as well
        status: "DONE",
        updatedAt: { gte: sevenDaysAgo },
      },
      select: {
        updatedAt: true,
        id: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    const formattedStatusCounts = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<TaskStatus, number>,
    );

    // Aggregate completed tasks by date
    const aggregatedCompletedOverTime = completedTasksRaw.reduce(
      (acc, curr) => {
        const dateStr = curr.updatedAt.toISOString().split("T")[0];
        const existing = acc.find((item) => item.date === dateStr);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date: dateStr ?? "", count: 1 });
        }
        return acc;
      },
      [] as { date: string; count: number }[],
    );

    return {
      statusCounts: formattedStatusCounts,
      completedOverTime: aggregatedCompletedOverTime,
    };
  }),
});
