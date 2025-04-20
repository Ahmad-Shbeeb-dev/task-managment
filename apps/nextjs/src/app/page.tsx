import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    // throw new AuthRequiredError({ redirect: true });
    redirect("/signin");
  }
  if (session.user.role === "ADMIN") redirect("/dashboard/home");
}
