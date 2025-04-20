"use client";

import React, { useState } from "react";

import { AddTaskForm } from "~/components/tasks/AddTaskForm";
import { TaskDashboardStats } from "~/components/tasks/TaskDashboardStats";
import { TaskList } from "~/components/tasks/TaskList";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

export default function DashboardHomePage() {
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
      </div>
    </>
  );
}
