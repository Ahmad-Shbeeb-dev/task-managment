"use client";

import { toast } from "sonner"; // Assuming sonner (or similar) is used for toasts

import type { TaskPriority, TaskStatus } from "@acme/db";

import { api } from "~/utils/api"; // Assuming tRPC client is setup here

import { TASK_STATUSES } from "~/utils/constants";
import { cn } from "~/utils/ui"; // Import cn utility

import { Badge } from "~/components/ui/Badge"; // For displaying priority/status visually

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import type { TaskOutput } from "~/types";

// Renamed from TaskItemPlaceholder and added status update logic
const TaskItem = ({ task }: { task: TaskOutput }) => {
  const utils = api.useUtils();

  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      toast.success(`Task "${task.title}" status updated!`);
      // Invalidate queries to refetch data
      await utils.task.getAll.invalidate();
      await utils.task.getStats.invalidate(); // Also invalidate stats if they depend on status
    },
    onError: (error) => {
      toast.error(`Failed to update task status: ${error.message}`);
      // Optionally revert optimistic update if implemented
    },
  });

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === task.status) return; // No change

    updateTaskStatusMutation.mutate({
      id: task.id,
      status: newStatus,
    });
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

export function TaskList() {
  // Fetch tasks using tRPC hook (useInfiniteQuery for pagination/infinite scroll)
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
    },
    {
      // Check if lastPage exists before accessing nextCursor
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // Optional: Configure staleTime, cacheTime etc.
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-4 text-center shadow-md">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-4 text-red-500 shadow-md">
        Error loading tasks: {error.message}
      </div>
    );
  }

  // Use flatMap for cleaner rendering of pages
  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  if (allTasks.length === 0) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>No tasks found.
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>
      <div>
        {allTasks.map((task: TaskOutput) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      {hasNextPage && (
        <div className="mt-4 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
