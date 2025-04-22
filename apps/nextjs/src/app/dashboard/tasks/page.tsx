"use client";

import { PageShell } from "~/components/shells/PageShell";
import { AddTaskDialog } from "~/components/tasks/AddTaskDialog";
import { TaskList } from "~/components/tasks/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";

export default function TasksPage() {
  return (
    <PageShell>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Tasks</CardTitle>
          <AddTaskDialog />
        </CardHeader>
        <CardContent>
          <TaskList />
        </CardContent>
      </Card>
    </PageShell>
  );
}
