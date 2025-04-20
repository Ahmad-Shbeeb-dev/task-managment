/* eslint-disable @typescript-eslint/await-thenable */
// import { auth } from "@acme/auth";

import { TRPCError } from "@trpc/server";

import { auth } from "@acme/auth";

import { appRouter } from "./root";
import { createInnerTRPCContext } from "./trpc";

export const serverSideCallerPublic = async () => {
  const ctx = await createInnerTRPCContext({ session: null, token: null });
  const caller = appRouter.createCaller(ctx);

  return caller;
};

export const serverSideCallerProtected = async () => {
  const session = await auth();
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const ctx = await createInnerTRPCContext({ session, token: null });
  const caller = appRouter.createCaller(ctx);
  return caller;
};
