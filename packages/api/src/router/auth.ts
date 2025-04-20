import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

import type { Session } from "@acme/auth";
import {
  adapter,
  invalidateSessionToken,
  sessionTokenMaxAge,
} from "@acme/auth";
import type { UserRole } from "@acme/db";

import { convertImagePathsToBase64 } from "../../utils";
import { sendMail } from "../nodemailer";
import { serverSideCallerPublic } from "../serverSideCaller";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  checkEmailValidation,
  loginUserValidation,
  resetPasswordValidation,
} from "../validations/auth";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    const base64UserImage = await convertImagePathsToBase64([
      { image: ctx.session?.user?.image },
    ]);

    let session: Session | null = null;
    if (ctx.session) {
      session = {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          image: base64UserImage[0]?.image,
        },
      };
    }

    return session;
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.token)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Session token not found!!",
      });

    // unregister parent notification after singing out
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { notificationToken: null },
    });

    await invalidateSessionToken(ctx.token);
  }),

  signIn: publicProcedure
    .input(loginUserValidation)
    .mutation(async ({ input }) => {
      const oauthToken = nanoid(256);
      const caller = await serverSideCallerPublic();
      const user = await caller.user.loginUser({
        email: input.email,
        password: input.password,
      });

      if (user) {
        //TODO only parents can access mobile app, the manager access it for chat only

        await adapter.createSession?.({
          userId: user.id,
          expires: new Date(Date.now() + sessionTokenMaxAge * 1000),
          sessionToken: oauthToken,
        });

        // Any object returned will be saved in `user` property of the JWT
        const userJwt: {
          id: string;
          name: string | null;
          email: string | null;
          role: UserRole;
          image: string | null;
          sessionToken: string;
        } = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          sessionToken: oauthToken,
        };

        return userJwt;
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        return null;
      }
    }),

  resetPassword: publicProcedure
    .input(checkEmailValidation)
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

      const confirmationCode = nanoid(10);
      const currentDate = new Date();
      const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000); // Add 3600000 milliseconds (1 hour)

      //delete previously requested password resets
      await ctx.prisma.passwordReset.deleteMany({
        where: { userId: foundUser.id },
      });

      //delete previous sessions
      await ctx.prisma.session.deleteMany({
        where: { userId: foundUser.id },
      });

      await ctx.prisma.passwordReset.create({
        data: {
          userId: foundUser.id,
          code: confirmationCode,
          expires: oneHourLater,
        },
      });

      await sendMail({
        to: input.email,
        subject: "Password Reset Request",
        text: `Your confirmation code is: ${confirmationCode}\n\nUse this code within 1 hour.`,
      });

      const result = { email: foundUser.email! };

      return result;
    }),

  resetPasswordConfirmation: publicProcedure
    .input(resetPasswordValidation)
    .mutation(async ({ ctx, input }) => {
      const foundCode = await ctx.prisma.passwordReset.findUnique({
        where: {
          code: input.code,
          expires: {
            gte: new Date(),
          },
        },
      });

      if (!foundCode)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wrong/Expired confirmation code!!",
        });

      //delete previously requested password resets
      await ctx.prisma.passwordReset.deleteMany({
        where: { userId: foundCode.userId },
      });

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const updatedPassword = await ctx.prisma.account.update({
        where: { userId: foundCode.userId },
        data: { password: hashedPassword },
        select: { user: { select: { email: true } } },
      });

      const result = { email: updatedPassword.user.email! };

      return result;
    }),
});
