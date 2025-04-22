"use client";

import { useState } from "react"; // Import useState

import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react"; // Import useSession for user role check
import { toast } from "sonner"; // Assuming sonner (or similar) is used for toasts

import type { TaskPriority, TaskStatus } from "@acme/db";

import { api } from "~/utils/api"; // Assuming tRPC client is setup here
import { STATUS_FILTER_OPTIONS, TASK_STATUSES } from "~/utils/constants";
import { cn } from "~/utils/ui"; // Import cn utility

import { Badge } from "~/components/ui/Badge"; // For displaying priority/status visually
import { Button } from "~/components/ui/Button"; // Added Button import for Load More
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
// Import Dialog components

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Skeleton } from "~/components/ui/Skeleton"; // Added Skeleton import

import type { TaskOutput } from "~/types";
import { AddTaskForm } from "./AddTaskForm"; // Import the task form for editing

// Renamed from TaskItemPlaceholder and added status update logic
const TaskItem = ({ task }: { task: TaskOutput }) => {
  const utils = api.useUtils();
  const { data: session } = useSession(); // Get session data to check user role
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
                  {status.replace("_", " ")}{" "}
                  {/* Replace underscore for display */}
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

// Skeleton component for TaskItem
const TaskItemSkeleton = () => (
  <div className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <Skeleton className="mb-1 h-5 w-3/5" /> {/* Title */}
      <Skeleton className="h-8 w-[130px]" /> {/* Status Select */}
    </div>
    <Skeleton className="mb-3 h-4 w-4/5" /> {/* Description */}
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Skeleton className="h-4 w-1/3" /> {/* Due Date */}
      <Skeleton className="h-5 w-16" /> {/* Priority Badge */}
      <Skeleton className="h-4 w-1/4" /> {/* Assigned To */}
    </div>
  </div>
);

export function TaskList() {
  // State for status filter
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");

  // Fetch tasks using tRPC hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.task.getAll.useInfiniteQuery(
    {
      limit: 10, // Fetch 10 tasks per page
      // Pass the status filter, converting 'ALL' to undefined for the API
      status: statusFilter === "ALL" ? undefined : statusFilter,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      staleTime: 5 * 60 * 1000, // 5 minutes
      // The query key automatically includes the input object.
      // When statusFilter changes, the query key changes, triggering a refetch.
    },
  );

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    // Type assertion is okay here as values come from our defined options
    setStatusFilter(value as TaskStatus | "ALL");
    // No need to manually refetch; the query reruns automatically.
  };

  // Combine rendering logic for cleaner return statement
  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
          {[...Array(3)].map((_, i) => (
            <TaskItemSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-destructive">Error loading tasks: {error.message}</p>
      );
    }

    const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];

    if (allTasks.length === 0) {
      return (
        <p className="text-muted-foreground">
          {statusFilter === "ALL"
            ? "No tasks found."
            : `No tasks found with status "${statusFilter.replace("_", " ")}".`}
        </p>
      );
    }

    return (
      <>
        <div>
          {allTasks.map((task: TaskOutput) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
        {hasNextPage && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task List Content */}
      {renderContent()}
    </div>
  );
}
