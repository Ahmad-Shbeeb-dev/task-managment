// Modules needed to support key generation, token encryption, and HTTP cookie manipulation
// import { redirect } from "next/navigation";
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { decode } from "@auth/core/jwt";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";

// import { env } from "~/env.mjs";

// export const runtime = "edge";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
}

// function removeJwt(res: Response) {
// cookies().set("next-auth.session-token", "");
//   res.headers.set("next-auth.session-token", "");
// }

export function OPTIONS() {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
}

//already authenticated requests comes here
const handler = auth(async (req) => {
  // const sessionToken = cookies().get("next-auth.session-token");
  // if (sessionToken) {
  //   const decodedSessionToken = await decode({
  //     token: sessionToken.value,
  //     secret: env.NEXTAUTH_SECRET,
  //   });
  //   console.log(
  //     "🚀 ~ file: index.ts:176 ~ authorized ~ sessionToken:",
  //     decodedSessionToken,
  //   );
  //   cookies().set("next-auth.session-token", "");
  //   // removeJwt(response);
  // }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () => createTRPCContext({ auth: req.auth, req }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });
  // cookies().set("next-auth.session-token", "");
  // removeJwt(response);

  setCorsHeaders(response);
  return response;
});

export { handler as GET, handler as POST };
