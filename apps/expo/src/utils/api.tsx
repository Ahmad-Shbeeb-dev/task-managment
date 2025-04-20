import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@acme/api";

import { getBaseUrl } from "./base-url";
import { getToken } from "./session-store";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@acme/api";

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

export function TRPCProvider(props: { children: React.ReactNode }) {
  // const [queryClient] = React.useState(() => new QueryClient());
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 300 * 1000, //consider the data fresh for 5 minutes
            refetchInterval: 300 * 1000, //refetch stale queries each 5 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            // retry: false,
            // cacheTime: 0,
            // staleTime: 0,
          },
          // mutations: {
          //   retry: false,
          //   cacheTime: 0,
          // },
        },
      }),
  );

  const [trpcClient] = React.useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // headers() {
          //   const headers = new Map<string, string>();
          //   headers.set("x-trpc-source", "expo-react");
          //   return Object.fromEntries(headers);
          // },
          headers: async () => {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            const token = await getToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            // console.log("🚀 ~ headers: ~ token:", token);

            return Object.fromEntries(headers);
          },
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
