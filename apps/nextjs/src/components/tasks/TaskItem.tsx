"use client";

import { useState } from "react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import type { TaskPriority, TaskStatus } from "@acme/db";

import { api } from "~/utils/api";
import { TASK_STATUSES } from "~/utils/constants";
import { cn } from "~/utils/ui";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import type { TaskOutput } from "~/types";
import { AddTaskForm } from "./AddTaskForm";

// Helper to get badge color based on priority
const getPriorityBadgeVariant = (
  priority: TaskPriority,
): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
  switch (priority) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "secondary";
    case "LOW":
      return "outline";
    default:
      return "default";
  }
};

export const TaskItem = ({ task }: { task: TaskOutput }) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  // Status update mutation
  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      toast.success(`Task "${task.title}" status updated!`);
      // Invalidate queries to refetch data
      await utils.task.getAll.invalidate(); // Invalidate all pages
      await utils.task.getStats.invalidate(); // Also invalidate stats if they depend on status
    },
    onError: (error) => {
      toast.error(`Failed to update task status: ${error.message}`);
      // Optionally revert optimistic update if implemented
    },
  });

  // Delete task mutation
  const deleteTaskMutation = api.task.delete.useMutation({
    onSuccess: async () => {
      toast.success(`Task "${task.title}" deleted!`);
      // Invalidate queries to refetch data
      await utils.task.getAll.invalidate();
      await utils.task.getStats.invalidate();
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === task.status) return; // No change

    updateTaskStatusMutation.mutate({
      id: task.id,
      status: newStatus,
    });
  };

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate({ id: task.id });
  };

  return (
    <div className="bg-card text-card-foreground mb-3 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="mb-1 font-semibold leading-tight">{task.title}</h3>
        <div className="flex items-center gap-2">
          {/* Status Update Select Dropdown */}
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) => handleStatusChange(value)}
            disabled={updateTaskStatusMutation.isLoading}
          >
            <SelectTrigger className="w-[130px] text-xs">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Edit Button - Only for Admins */}
          {isAdmin && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <IconPencil className="h-4 w-4" />
                  <span className="sr-only">Edit task</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <AddTaskForm
                  initialData={task}
                  onSuccess={() => setIsEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Delete Button with Confirmation Dialog - Only for Admins */}
          {isAdmin && (
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive h-8 w-8 p-0"
                >
                  <IconTrash className="h-4 w-4" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task "{task.title}"?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteTask}
                    disabled={deleteTaskMutation.isLoading}
                  >
                    {deleteTaskMutation.isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <p className="text-muted-foreground mb-3 text-sm">
        {task.description ?? "No description"}
      </p>
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
        <span
          className={cn(
            task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== "DONE" &&
              "font-semibold text-red-500",
          )}
        >
          Due:{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
          {task.isRecurring && ` (${task.recurringType})`}
        </span>
        <Badge
          variant={getPriorityBadgeVariant(task.priority)}
          className="text-xs"
        >
          {task.priority}
        </Badge>
        {task.assignedTo?.name && <span>Assigned: {task.assignedTo.name}</span>}
        {/* Maybe add created/updated dates if needed */}
      </div>
      {task.isRecurring && task.nextOccurrence && (
        <p className="mt-1 text-xs text-blue-600">
          Next occurrence: {new Date(task.nextOccurrence).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
