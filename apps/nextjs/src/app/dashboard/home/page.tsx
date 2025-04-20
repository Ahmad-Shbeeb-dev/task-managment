"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Activities } from "~/components/Activities";
import { Attendance } from "~/components/Attendance";
import { Sections } from "~/components/Sections";
import { Tabs } from "~/components/Tabs";
import { AddTaskForm } from "~/components/tasks/AddTaskForm";
import { TaskDashboardStats } from "~/components/tasks/TaskDashboardStats";
import { TaskList } from "~/components/tasks/TaskList";
import { Button } from "~/components/ui/Button";
import { Calendar } from "~/components/ui/Calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

export default function ClassPage() {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-row">
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
                <AddTaskForm
                  onTaskAdded={() => setIsAddTaskDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <TaskDashboardStats />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TaskList />
              </div>

              <div className="space-y-6">
                <Attendance />
                <Activities />
                <Calendar
                  className="rounded-lg border bg-white shadow-sm"
                  selected={new Date()}
                  classNames={{
                    day_today: "bg-primary text-primary-foreground",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
