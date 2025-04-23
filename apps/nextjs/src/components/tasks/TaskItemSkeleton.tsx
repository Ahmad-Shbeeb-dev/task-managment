"use client";

import { Skeleton } from "~/components/ui/Skeleton";

export const TaskItemSkeleton = ({
  isKanbanView,
}: {
  isKanbanView?: boolean;
}) => (
  <div className="dark:bg-card mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700">
    <div className="flex items-start justify-between">
      <Skeleton className="mb-1 h-5 w-3/5" /> {/* Title */}
      {!isKanbanView && <Skeleton className="h-8 w-[130px]" />}{" "}
      {/* Status Select */}
    </div>
    <Skeleton className="mb-3 h-4 w-4/5" /> {/* Description */}
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Skeleton className="h-4 w-1/3" /> {/* Due Date */}
      <Skeleton className="h-5 w-16" /> {/* Priority Badge */}
      <Skeleton className="h-4 w-1/4" /> {/* Assigned To */}
    </div>
  </div>
);
