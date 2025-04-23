"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { api } from "~/utils/api";
import { RefreshButton } from "~/components/RefreshButton";
import { useTasks } from "~/hooks/useTasks";
import type { ViewMode } from "~/types";
import { TaskFilter } from "./TaskFilter";
import { TasksList } from "./TasksList";
import { TaskViewToggle } from "./TaskViewToggle";

export function TaskList() {
  const [parent] = useAutoAnimate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const utils = api.useUtils();

  const {
    tasks,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    statusFilter,
    handleStatusFilterChange,
    userFilter,
    handleUserFilterChange,
    sortOrder,
    handleSortOrderChange,
  } = useTasks();

  const handleRefresh = () => {
    void utils.task.getAll.invalidate();
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <TaskFilter
          statusValue={statusFilter}
          onStatusChange={handleStatusFilterChange}
          userValue={userFilter}
          onUserChange={handleUserFilterChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
        />
        <RefreshButton handleRefresh={handleRefresh} className="mr-auto" />
        <TaskViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Task List Content */}
      <div ref={parent}>
        <TasksList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          statusFilter={statusFilter}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
