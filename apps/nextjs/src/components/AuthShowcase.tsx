import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

// import { AuthRequiredError } from "~/utils/exceptions";
import { LogOutButtons } from "./auth/LogoutButtons";

export async function AuthShowcase() {
  const session = await auth();
  if (!session) {
    // throw new AuthRequiredError({ redirect: true });
    redirect("/signin");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        <span>Logged in as {session.user.name}</span>
      </p>
      <LogOutButtons />
    </div>
  );
}
