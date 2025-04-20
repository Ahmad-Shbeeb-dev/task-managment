import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signIn as nextAuthSignin,
  signOut as nextAuthSignout,
} from "next-auth/react";
import { toast } from "sonner";
import type { z } from "zod";

import type {
  checkEmailValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
} from "@acme/api/validations";
import type { OAuthProviders } from "@acme/auth";

import { api } from "~/utils/api";
import { catchError, nextAuthErrors } from "~/utils/error";

type RegisterInputs = z.infer<typeof registerUserValidation>;
type LoginInputs = z.infer<typeof loginUserValidation>;
type ResetPasswordInputs = z.infer<typeof checkEmailValidation>;
type ResetPasswordConfirmationInputs = z.infer<typeof resetPasswordValidation>;

export const useAuth = () => {
  const router = useRouter();
  const ctx = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: signupUserMutation } =
    api.user.registerUser.useMutation();
  const { mutateAsync: resetPasswordMutation } =
    api.auth.resetPassword.useMutation();

  const { mutateAsync: resetPasswordConfirmationMutation } =
    api.auth.resetPasswordConfirmation.useMutation();

  async function signin(loginInputs: LoginInputs) {
    try {
      setIsLoading(true);

      const result = await nextAuthSignin("credentials", {
        email: loginInputs.email,
        password: loginInputs.password,
        // callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          nextAuthErrors[result.error as keyof typeof nextAuthErrors] ??
          nextAuthErrors.default;
        setIsLoading(false);
        throw new Error(errorMessage);
      }

      setIsLoading(false);

      // router.refresh();
      router.push(`${window.location.origin}/`);
      toast.success("Successfully Signed in");
      // router.replace("/");

      return result;
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }
  async function oAuthSignin(provider: OAuthProviders) {
    try {
      setIsLoading(true);

      const result = await nextAuthSignin(provider, {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          nextAuthErrors[result.error as keyof typeof nextAuthErrors] ??
          nextAuthErrors.default;
        setIsLoading(false);
        throw new Error(errorMessage);
      }

      setIsLoading(false);

      // router.replace("/");

      return result;
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  // async function signup(email: string, name: string, password: string) {
  async function signup(
    registerInputs: RegisterInputs,
    {
      isSuperAdmin,
    }: {
      isSuperAdmin?: boolean;
    },
  ) {
    try {
      setIsLoading(true);
      const createdUser = await signupUserMutation({ ...registerInputs });

      if (createdUser && isSuperAdmin) {
        setIsLoading(false);
        toast.success("Successfully Signed up");
        return ctx.invalidate();
      }

      if (createdUser && !isSuperAdmin) {
        await signin({
          email: registerInputs.email,
          password: registerInputs.password,
        });
        setIsLoading(false);
        return createdUser;
      }
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  async function signout() {
    try {
      setIsLoading(true);
      await nextAuthSignout({ callbackUrl: "/signin", redirect: true });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  async function resetPassword(resetPasswordInputs: ResetPasswordInputs) {
    try {
      setIsLoading(true);
      const resetEmail = await resetPasswordMutation({
        ...resetPasswordInputs,
      });

      if (resetEmail) {
        setIsLoading(false);
        return resetEmail;
      }
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  async function resetPasswordConfirmation(
    resetPasswordConfirmationInputs: ResetPasswordConfirmationInputs,
  ) {
    try {
      setIsLoading(true);
      const updatedEmail = await resetPasswordConfirmationMutation({
        ...resetPasswordConfirmationInputs,
      });

      if (updatedEmail) {
        await signin({
          email: updatedEmail.email,
          password: resetPasswordConfirmationInputs.password,
        });
        setIsLoading(false);
        return updatedEmail;
      }
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  return {
    isLoading,
    signup,
    signin,
    signout,
    oAuthSignin,
    resetPassword,
    resetPasswordConfirmation,
  };
};
