import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { OAuthSignIn } from "~/components/auth/OauthSignin";
import { SignUpForm } from "~/components/forms/auth-form/SignupForm";
import { Shell } from "~/components/shells/Shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { env } from "~/env.mjs";

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign Up",
  description: "Sign up for an account",
};

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <Shell className="max-h-screen max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          {/* <CardDescription>
            Choose your preferred sign up method
          </CardDescription> */}
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div> */}
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              aria-label="Sign in"
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
