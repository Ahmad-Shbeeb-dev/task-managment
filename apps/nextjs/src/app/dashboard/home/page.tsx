"use client";

import { PageShell } from "~/components/shells/PageShell";
import { TaskDashboardStats } from "~/components/tasks/TaskDashboardStats";

export default function HomePage() {
  return (
    <PageShell>
      <TaskDashboardStats />
    </PageShell>
  );
}
