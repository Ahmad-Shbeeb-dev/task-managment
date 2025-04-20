import type { DefaultSession } from "@auth/core/types";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import type { Session, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import type { UserRole } from "@acme/db";
import { prisma } from "@acme/db";

import { serverSideCallerPublic } from "../api/index";
import { loginUserValidation } from "../api/src/validations/auth";
import { env } from "./env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["google", "credentials"] as const;
export type OAuthProviders = Exclude<(typeof providers)[number], "credentials">;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
  interface User {
    role: UserRole;
    sessionToken: string;
  }
}

export const adapter = PrismaAdapter(prisma);
export const sessionTokenMaxAge = 60 * 60 * 24 * 30; // 30 days
const oauthToken = nanoid(256);

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth(
  {
    adapter,
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),

      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        // id: "username-login",
        name: "CredentialsProvider",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        // credentials: {
        //   email: { label: "Email", type: "email" },
        //   password: { label: "Password", type: "password" },
        // },
        async authorize(credentials) {
          try {
            // console.log({ credentials });
            const { email, password } = loginUserValidation.parse(credentials);

            // Add logic here to look up the user from the credentials supplied
            const caller = await serverSideCallerPublic();
            const user = await caller.user.loginUser({ email, password });

            if (user) {
              const token = nanoid(256);
              await adapter.createSession?.({
                userId: user.id,
                expires: new Date(Date.now() + sessionTokenMaxAge * 1000),
                sessionToken: token,
              });

              // Any object returned will be saved in `user` property of the JWT
              const userJwt: User = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                sessionToken: token,
              };

              return userJwt;
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
              return null;
            }
          } catch (err) {
            console.error(">>>> auth error", err);
            return null;
          }
        },
      }),
    ],
    events: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      signOut: async ({ token, session }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (token?.sessionToken) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          await adapter.deleteSession?.(token.sessionToken);
        }
      },
    },
    callbacks: {
      //for oauth only
      session: ({ session, user, token }) => {
        return {
          ...session,
          user: {
            ...session.user,
            id: user?.id ?? token?.id,
            role: user?.role ?? token?.role,
          },
        };
      },

      //for credentials & oauth
      // @TODO - if you wanna have auth on the edge
      async jwt({ token, user, account }) {
        try {
          delete token.picture;
          const isCredential = account?.provider === "credentials";
          if (user) {
            token.id = user.id;
            token.role = user.role;
            token.image = user.image;
            token.sessionToken = user?.sessionToken ?? oauthToken;
          }
          if (token?.sessionToken) {
            const session = await adapter.getSessionAndUser?.(
              token.sessionToken as string,
            );

            if (!isCredential && !session?.session) {
              const createdAuthSession = await adapter.createSession?.({
                userId: user.id,
                expires: new Date(Date.now() + sessionTokenMaxAge * 1000),
                sessionToken: oauthToken,
              });

              token.sessionToken = createdAuthSession?.sessionToken;
              return token;
            }

            if (!session?.session) {
              return null;
            }
          }
          return token;
        } catch (error) {
          return null;
          // throw new Error(
          //   "UNAUTHORIZED >>> deleted user sessionToken from db but the user keeps requesting from the deleted sessionToken",
          // );
        }
      },

      // middleware for all requests
      // async authorized({ request, auth }) {
      //   const sessionToken = cookies().get("next-auth.session-token");
      //   if (sessionToken) {
      //     const decodedSessionToken = await decode({
      //       token: sessionToken.value,
      //       secret: env.NEXTAUTH_SECRET,
      //     });
      //     console.log(
      //       "🚀 ~ file: index.ts:194 ~ authorized ~ decodedSessionToken:",
      //       decodedSessionToken,
      //     );
      //     const response = NextResponse.json("Invalid auth token", {
      //       status: 401,
      //     });
      //     // response.cookies.delete("next-auth.session-token");
      //     response.cookies.set("next-auth.session-token", "");
      //     response.headers.set("next-auth.session-token", "");
      //     // response.headers.delete("next-auth.session-token");
      //     return response;
      //   }
      //   return !!auth?.user;
      // },
    },

    session: {
      // Choose how you want to save the user session.
      // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
      // If you use an `adapter` however, we default it to `"database"` instead.
      // You can still force a JWT session by explicitly defining `"jwt"`.
      // When using `"database"`, the session cookie will only contain a `sessionToken` value,
      // which is used to look up the session in the database.
      strategy: "jwt",
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: sessionTokenMaxAge,
      // Seconds - Throttle how frequently to write to database to extend a session.

      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
      // The session token is usually either a random UUID or string, however if you
      // need a more customized session token string, you can define your own generate function.
      // generateSessionToken: () =>  randomUUID()
    },
  },
  // pages: {
  //   error: "/signin",
  // },
);

export const validateToken = async (token: string): Promise<Session | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: session.user,
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
