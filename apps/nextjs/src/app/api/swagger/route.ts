import { NextResponse } from "next/server";
import { renderTrpcPanel } from "trpc-panel";

import { appRouter } from "@acme/api";
import type { Session } from "@acme/auth";
import { auth } from "@acme/auth";

export async function GET(req: Request) {
  const session: Session | null = await auth();
  console.log({ session });
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.redirect(new URL("/", req.url));

  const getBaseUrl = () => {
    // if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return process.env.VERCEL_URL; // SSR should use vercel url

    return `http://localhost:${process.env.PORT}`; // dev SSR should use localhost
  };

  const swaggerPanel = renderTrpcPanel(appRouter, {
    url: `${getBaseUrl()}/api/trpc`,
    transformer: "superjson",
  });

  return new NextResponse(swaggerPanel, {
    headers: { "content-type": "text/html" },
  });
}
