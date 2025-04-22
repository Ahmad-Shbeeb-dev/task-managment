import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { differenceInMinutes, format } from "date-fns";
import { z } from "zod";

import { adapter } from "@acme/auth";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureAdmin,
  publicProcedure,
} from "../trpc";
import {
  authValidation,
  loginUserValidation,
  updateUserValidation,
} from "../validations/auth";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(authValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists!!",
        });

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const audit = { createdBy: input.createdBy, updatedBy: input.createdBy };
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: input.role ?? "USER",
          ...audit,
          Accounts: {
            create: {
              password: hashedPassword,
              provider: "credentials",
              type: "credentials",
              providerAccountId: input.email,
              ...audit,
            },
          },
        },
        select: { id: true, email: true, name: true, role: true },
      });
    }),

  loginUser: publicProcedure
    .input(loginUserValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      const userAccount = await ctx.prisma.account.findUniqueOrThrow({
        where: { userId: foundUser.id },
      });

      const passwordMatches = userAccount.password
        ? await bcrypt.compare(input.password, userAccount.password)
        : false;

      if (!passwordMatches) {
        if (userAccount.failedSignins && userAccount.failedSignins >= 10) {
          const differenceInMinutesLastTry = differenceInMinutes(
            new Date(),
            userAccount.updatedAt,
          );

          if (differenceInMinutesLastTry <= 10)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Account locked!! try again after ${10 - differenceInMinutesLastTry} minutes`,
            });

          await ctx.prisma.account.update({
            where: { id: userAccount.id },
            data: { failedSignins: 0 },
          });
        }

        await ctx.prisma.account.update({
          where: { id: userAccount.id },
          data: { failedSignins: { increment: 1 } },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wrong password!!",
        });
      }

      // Reset failed signins on successful login
      if (userAccount.failedSignins && userAccount.failedSignins > 0) {
        await ctx.prisma.account.update({
          where: { id: userAccount.id },
          data: { failedSignins: 0 },
        });
      }

      return foundUser;
    }),

  getAll: protectedProcedureAdmin.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({});
  }),

  getNotificationToken: protectedProcedure
    .input(z.object({ userEmail: z.string() }))
    .query(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { email: input.userEmail },
        select: { id: true, email: true, notificationToken: true },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      return foundUser;
    }),

  upsertNotificationToken: protectedProcedure
    .input(z.object({ notificationToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email ?? "" },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      const updatedUser = await ctx.prisma.user.update({
        where: { id: foundUser.id },
        data: { notificationToken: input.notificationToken },
      });

      return updatedUser;
    }),

  updateUser: protectedProcedure
    .input(updateUserValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User doesn't exist!!",
        });

      return ctx.prisma.user.update({
        where: { id: foundUser.id },
        data: {
          email: input.email,
          name: input.name,
          updatedBy: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          role: true,
          email: true,
        },
      });
    }),

  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }),
});
