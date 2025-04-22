import { useState } from "react";

import type { TaskStatus } from "@acme/db";

import { api } from "~/utils/api";

export const useTasks = () => {
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

  // Process the data
  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  return {
    tasks: allTasks,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    statusFilter,
    handleStatusFilterChange,
  };
};
