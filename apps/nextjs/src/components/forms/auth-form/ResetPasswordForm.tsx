"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { checkEmailValidation } from "@acme/api/validations";

import { catchError } from "~/utils/error";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { useAuth } from "~/hooks";

type Inputs = z.infer<typeof checkEmailValidation>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isLoading, resetPassword } = useAuth();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailValidation),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Inputs) {
    // if (!isLoaded) return;
    startTransition(async () => {
      const resetEmail = await resetPassword({ ...data });
      if (resetEmail) {
        router.push("/signin/reset-password/step2");
        toast.message("Check your email", {
          description: "We sent you a 10-digit verification code.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading}>
          {isLoading && (
            <IconLoader
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          <span className="sr-only">
            Continue to reset password verification
          </span>
        </Button>
      </form>
    </Form>
  );
}
