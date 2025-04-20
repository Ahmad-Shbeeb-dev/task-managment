"use client";

import React, { useState } from "react";

// Removed Link import as it's unused after component removal
// import Link from "next/link";

// Removed unused component imports
// import { Activities } from "~/components/Activities";
// import { Attendance } from "~/components/Attendance";
// import { Sections } from "~/components/Sections";
// import { Tabs } from "~/components/Tabs";
import { AddTaskForm } from "~/components/tasks/AddTaskForm";
import { TaskDashboardStats } from "~/components/tasks/TaskDashboardStats";
import { TaskList } from "~/components/tasks/TaskList";
import { Button } from "~/components/ui/Button";
// Removed unused component import
// import { Calendar } from "~/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
// Added Card imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

export default function ClassPage() {
  // Consider renaming to DashboardHomePage or similar
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  return (
    <>
      {/* Simplified the outer div structure */}
      <div className="flex w-full flex-col gap-6 bg-slate-50 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Task Dashboard</h1>
          <Dialog
            open={isAddTaskDialogOpen}
            onOpenChange={setIsAddTaskDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Add New Task +</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <AddTaskForm onTaskAdded={() => setIsAddTaskDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Wrap TaskDashboardStats in a Card */}
        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskDashboardStats />
          </CardContent>
        </Card>

        {/* Wrap TaskList in a Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            {/* Potential location for filtering/sorting controls in the future */}
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>

        {/* Removed the grid layout and the unrelated components */}
        {/* <div className="space-y-6"> ... </div> */}
      </div>
    </>
  );
}
