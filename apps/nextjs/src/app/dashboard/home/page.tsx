import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { PageShell } from "~/components/shells/PageShell";
import { TaskDashboardStats } from "~/components/tasks/TaskDashboardStats";

export default async function HomePage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/dashboard/tasks");

  return (
    <PageShell>
      <TaskDashboardStats />
    </PageShell>
  );
}
