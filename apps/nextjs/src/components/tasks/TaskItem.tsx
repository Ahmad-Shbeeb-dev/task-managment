"use client";

import { useState } from "react";
import { IconCheckbox, IconPencil, IconTrash } from "@tabler/icons-react";
import { motion } from "framer-motion";
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

export const TaskItem = ({
  task,
  isKanbanView,
}: {
  task: TaskOutput;
  isKanbanView?: boolean;
}) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isPastDue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

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

  const handleMarkAsDone = () => {
    if (task.status === "DONE") return;

    updateTaskStatusMutation.mutate({
      id: task.id,
      status: "DONE",
    });
  };

  return (
    <div
      className={cn(
        "bg-card group relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/75",
        task.status === "DONE" && "opacity-70",
        isKanbanView && "hover:translate-y-[-2px]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {task.status !== "DONE" && (
        <motion.div
          className="absolute -right-1 -top-1 cursor-pointer rounded-full bg-green-100 p-1 opacity-0 transition-opacity dark:bg-green-900/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMarkAsDone}
          title="Mark as done"
        >
          <IconCheckbox className="h-4 w-4 text-green-600 dark:text-green-400" />
        </motion.div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "mb-1 font-semibold leading-tight transition-all",
            task.status === "DONE" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </h3>

        <div className="flex items-center gap-2">
          {/* Status Update Select Dropdown - Only show when not in kanban view */}
          {!isKanbanView && (
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
          )}

          {/* Edit Button - Only for Admins */}
          {isAdmin && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100",
                    isHovered && "opacity-100",
                  )}
                >
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
                  className={cn(
                    "text-destructive h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100",
                    isHovered && "opacity-100",
                  )}
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

      <p
        className={cn(
          "text-muted-foreground mb-3 text-sm",
          task.status === "DONE" && "text-muted-foreground/70",
        )}
      >
        {task.description ?? "No description"}
      </p>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span
          className={cn(
            isPastDue && "font-semibold text-red-500",
            task.status === "DONE" && "text-muted-foreground/70",
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

        {task.assignedTo?.name && (
          <span
            className={task.status === "DONE" ? "text-muted-foreground/70" : ""}
          >
            Assigned: {task.assignedTo.name}
          </span>
        )}
      </div>

      {task.isRecurring && task.nextOccurrence && (
        <p
          className={cn(
            "mt-1 text-xs text-blue-600",
            task.status === "DONE" && "text-blue-600/70",
          )}
        >
          Next occurrence: {new Date(task.nextOccurrence).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
