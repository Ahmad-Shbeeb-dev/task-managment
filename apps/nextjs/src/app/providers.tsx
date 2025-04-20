"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import superjson from "superjson";

import { api } from "~/utils/api";
import { catchError } from "~/utils/error";
import { env } from "~/env.mjs";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (env.VERCEL_URL) return env.VERCEL_URL; // SSR should use vercel url

  return `http://localhost:${env.PORT}`; // dev SSR should use localhost
  // return `http://192.168.1.200:${env.PORT}`; // dev SSR should use localhost
};

// //redirect to sign-in page if trpcError throws 'UNAUTHORIZED'
// const customLink: TRPCLink<AppRouter> = () => {
//   // here we just got initialized in the app - this happens once per app
//   // useful for storing cache for instance
//   return ({ next, op }) => {
//     // this is when passing the result to the next link
//     // each link needs to return an observable which propagates results
//     return observable((observer) => {
//       // console.log('performing operation:', op);
//       const unsubscribe = next(op).subscribe({
//         next(value) {
//           //console.log("we received value", value);
//           observer.next(value);
//         },
//         error(err) {
//           // console.log("we received error", err);
//           observer.error(err);
//           if (err?.data?.code === "UNAUTHORIZED") {
//             const win: Window = window;
//             win.location = "/signin"; //sign-in page
//           }
//         },
//         complete() {
//           observer.complete();
//         },
//       });
//       return unsubscribe;
//     });
//   };
// };

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 300 * 1000, //consider the data fresh for 5 minutes
            refetchInterval: 300 * 1000, //refetch stale queries each 5 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            onError(err) {
              catchError(err);
            },
          },
          mutations: {
            onError(err) {
              catchError(err);
            },
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        // customLink,
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            const headers = new Map(props.headers);
            headers.set("x-trpc-source", "nextjs-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration transformer={superjson}>
          <SessionProvider>{props.children}</SessionProvider>
          <Toaster richColors />
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}
