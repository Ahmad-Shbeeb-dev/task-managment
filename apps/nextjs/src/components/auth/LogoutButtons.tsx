"use client";

import { useTransition } from "react";
import { IconLoader } from "@tabler/icons-react";

import { cn } from "~/utils/ui";
import { Button, buttonVariants } from "~/components/ui/Button";
import { Skeleton } from "~/components/ui/Skeleton";
import { useAuth, useMounted } from "~/hooks";

export function LogOutButtons() {
  const mounted = useMounted();
  const [isPending, startTransition] = useTransition();
  const { isLoading, signout } = useAuth();

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        // <SignOutButton
        //   signOutCallback={() =>
        // startTransition(() => {
        //   router.push(`${window.location.origin}/?redirect=false`);
        // })
        //   }
        // >
        <Button
          aria-label="Log out"
          size="sm"
          className="w-full"
          disabled={isLoading}
          onClick={() =>
            startTransition(async () => {
              await signout();
            })
          }
        >
          {isLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
          Log out
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-muted text-muted-foreground w-full",
          )}
        >
          Log out
        </Skeleton>
      )}
    </div>
  );
}
