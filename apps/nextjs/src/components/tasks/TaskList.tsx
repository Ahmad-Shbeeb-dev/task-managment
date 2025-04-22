"use client";

import { useTasks } from "~/hooks/useTasks";
import { TaskFilter } from "./TaskFilter";
import { TasksList } from "./TasksList";

export function TaskList() {
  const {
    tasks,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    statusFilter,
    handleStatusFilterChange,
  } = useTasks();

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <TaskFilter value={statusFilter} onChange={handleStatusFilterChange} />

      {/* Task List Content */}
      <TasksList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        statusFilter={statusFilter}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
