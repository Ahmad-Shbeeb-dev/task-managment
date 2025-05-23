import type { Metadata } from "next";

import { ResetPasswordForm } from "~/components/forms/auth-form/ResetPasswordForm";
import { Shell } from "~/components/shells/Shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { env } from "~/env.mjs";

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
  description: "Enter your email to reset your password",
};

export default function ResetPasswordPage() {
  return (
    <Shell className="max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
