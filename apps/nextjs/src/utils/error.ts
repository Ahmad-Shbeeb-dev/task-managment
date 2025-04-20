/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";

export const nextAuthErrors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
} as const;

export function catchError(err: unknown) {
  if (err instanceof TRPCClientError && err?.data?.zodError) {
    const zodErrors = err.data.zodError.fieldErrors as {
      [key: string]: string[];
    };

    let errorMessage = "";
    Object.keys(zodErrors).forEach((field) => {
      const errors = zodErrors[field];
      errors?.forEach((error: unknown) => {
        errorMessage += `${field}: ${error}.  `;
      });
    });

    return toast.error(errorMessage);
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else {
    return toast.error("Something went wrong, please try again later.");
  }
}
