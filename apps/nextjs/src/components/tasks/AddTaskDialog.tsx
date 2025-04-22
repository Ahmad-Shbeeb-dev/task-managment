"use client";

import { useState } from "react";

import { AddTaskForm } from "~/components/tasks/AddTaskForm";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

export function AddTaskDialog() {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  return (
    <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
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
  );
}
