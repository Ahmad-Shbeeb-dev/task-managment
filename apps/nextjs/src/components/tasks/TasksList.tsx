"use client";

import type { TRPCClientErrorLike } from "@trpc/client";

import { Button } from "~/components/ui/Button";
import type { TaskOutput } from "~/types";
import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";

interface TasksListProps {
  tasks: TaskOutput[];
  isLoading: boolean;
  error: TRPCClientErrorLike<any> | null;
  statusFilter: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const TasksList = ({
  tasks,
  isLoading,
  error,
  statusFilter,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: TasksListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
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

  if (tasks.length === 0) {
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
        {tasks.map((task: TaskOutput) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      {hasNextPage && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage?.()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
};
