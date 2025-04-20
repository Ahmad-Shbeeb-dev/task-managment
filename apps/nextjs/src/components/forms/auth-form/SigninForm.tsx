"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { loginUserValidation } from "@acme/api/validations";

import { PasswordInput } from "~/components/PasswordInput";
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

type Inputs = z.infer<typeof loginUserValidation>;

export function SignInForm() {
  const { isLoading, signin } = useAuth();
  const [isPending, startTransition] = useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(loginUserValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Inputs) {
    // if (!isLoaded) return;
    startTransition(async () => {
      const createdUser = await signin({ ...data });

      // const result = await signIn.create({
      //   identifier: data.email,
      //   password: data.password,
      // });
      // if (result.status === "complete") {
      //   await setActive({ session: result.createdSessionId });
      //   router.push(`${window.location.origin}/`);
      // } else {
      //   /*Investigate why the login hasn't completed */
      //   console.log(result);
      // }
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
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
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
