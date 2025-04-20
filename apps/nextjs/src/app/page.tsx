import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  redirect("/dashboard/home");
}
