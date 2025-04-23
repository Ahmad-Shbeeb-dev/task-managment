"use client";

import type { TRPCClientErrorLike } from "@trpc/client";

import { Button } from "~/components/ui/Button";
import type { TaskOutput, ViewMode } from "~/types";
import { KanbanBoard } from "./KanbanBoard";
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
  viewMode: ViewMode;
}

export const TasksList = ({
  tasks,
  isLoading,
  error,
  statusFilter,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  viewMode,
}: TasksListProps) => {
  if (error) {
    return (
      <p className="text-destructive">Error loading tasks: {error.message}</p>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {viewMode === "list" ? (
          Array.from({ length: 3 }).map((_, i) => <TaskItemSkeleton key={i} />)
        ) : (
          <KanbanBoard tasks={[]} isLoading={true} />
        )}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground dark:text-gray-300">
        {statusFilter === "ALL"
          ? "No tasks found."
          : `No tasks found with status "${statusFilter.replace("_", " ")}".`}
      </p>
    );
  }

  // When in Kanban view, we always show all statuses, filter is not applicable
  if (viewMode === "kanban") {
    return <KanbanBoard tasks={tasks} isLoading={false} />;
  }

  // List view
  return (
    <div>
      {tasks.map((task: TaskOutput) => (
        <TaskItem key={task.id} task={task} />
      ))}
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
    </div>
  );
};
