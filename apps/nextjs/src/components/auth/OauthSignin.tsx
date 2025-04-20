"use client";

import * as React from "react";
// import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { IconBrandGoogle, IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";

import type { OAuthProviders } from "@acme/auth";

import { catchError } from "~/utils/error";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/hooks";

const oauthProviders = [
  {
    name: "Google",
    strategy: "google",
    icon: <IconBrandGoogle className="mr-2" size={20} stroke={1.5} />,
  },
] satisfies {
  name: string;
  icon: JSX.Element;
  strategy: OAuthProviders;
}[];

export function OAuthSignIn() {
  const { isLoading, oAuthSignin } = useAuth();

  async function oauthSignInHandle(provider: OAuthProviders) {
    try {
      await oAuthSignin(provider);
    } catch (err) {
      catchError(err);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4">
      {oauthProviders.map((provider) => {
        return (
          <Button
            disabled={isLoading}
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            className="bg-background w-full p-4 sm:w-auto"
            onClick={() => oauthSignInHandle(provider.strategy)}
          >
            {isLoading && (
              <IconLoader
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {provider.icon}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
