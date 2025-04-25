import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  if (session?.user.role === "ADMIN") {
    redirect("/dashboard/home");
  } else {
    redirect("/dashboard/tasks");
  }
}
