"use client";

import type { Dispatch, SetStateAction } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { registerUserValidation } from "@acme/api/validations";

import { cn } from "~/utils/ui";
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
import { Progress } from "~/components/ui/Progress";
import { useAuth, usePasswordStrength } from "~/hooks";
import type { Role } from "~/types";

type Inputs = z.infer<typeof registerUserValidation>;

interface Props {
  isSuperAdmin?: boolean;
  userName?: string;
  userRole?: Role;
  createdBy?: string;
  setDialogOpened?: Dispatch<SetStateAction<boolean>>;
}

export function SignUpForm({
  isSuperAdmin = false,
  userRole = "USER",
  userName,
  createdBy,
  setDialogOpened,
}: Props) {
  const { isLoading, signup } = useAuth();
  const [isPending, startTransition] = useTransition();
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(registerUserValidation),
    defaultValues: {
      email: "",
      name: userName,
      password: "",
      confirmPassword: "",
      role: userRole,
      createdBy: createdBy,
      // dateOfBirth: new Date("1900-01-01"),
      // gender: "",
    },
  });
  const { passwordScore, setPassword } = usePasswordStrength();
  const router = useRouter();

  function onSubmit(data: Inputs) {
    // if (!isLoading) return;
    startTransition(async () => {
      await signup({ ...data }, { isSuperAdmin: true });

      if (setDialogOpened) setDialogOpened(false);
      // router.push(`${window.location.origin}/teacher/home`);
      // await signUp.create({
      //   emailAddress: data.email,
      //   password: data.password,
      // });
      // // Send email verification code
      // await signUp.prepareEmailAddressVerification({
      //   strategy: "email_code",
      // });
      // router.push("/signup/verify-email");
      // toast.message("Check your email", {
      //   description: "We sent you a 6-digit verification code.",
      // });
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!passwordScore && (
          <Progress
            value={passwordScore}
            className={cn("", {
              "bg-red-300": passwordScore <= 25,
              "bg-orange-300": passwordScore > 25 && passwordScore <= 50,
              "bg-blue-300": passwordScore > 50 && passwordScore < 100,
              "bg-green-300": passwordScore === 100,
            })}
          />
        )}

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex justify-between gap-2">
          {/* User Role */}
          {/* {isSuperAdmin && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-3 xl:col-span-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role, idx) => {
                        return (
                          <SelectItem
                            key={`${idx}_${role.toLowerCase()}`}
                            value={role}
                          >
                            {role.toLowerCase()}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}
        </div>

        <Button disabled={isLoading} className="mt-3">
          {isLoading && (
            <IconLoader
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          {/* <span className="sr-only">Continue to email verification page</span> */}
        </Button>
      </form>
    </Form>
  );
}
