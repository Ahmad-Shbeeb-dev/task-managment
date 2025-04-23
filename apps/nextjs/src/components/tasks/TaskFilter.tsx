"use client";

import { useSession } from "next-auth/react";

import type { TaskStatus } from "@acme/db";

import { api } from "~/utils/api";
import { STATUS_FILTER_OPTIONS } from "~/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";

interface TaskFilterProps {
  statusValue: TaskStatus | "ALL";
  onStatusChange: (value: string) => void;
  userValue: string | "ALL";
  onUserChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
}

export const TaskFilter = ({
  statusValue,
  onStatusChange,
  userValue,
  onUserChange,
  sortOrder,
  onSortOrderChange,
}: TaskFilterProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // Only fetch users if the current user is an admin
  const { data: usersData } = api.user.getAll.useQuery(undefined, {
    enabled: isAdmin,
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      {/* Status Filter */}
      <Select value={statusValue} onValueChange={onStatusChange}>
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

      {/* User Filter - Only show for admin users */}
      {isAdmin && (
        <Select value={userValue} onValueChange={onUserChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Users</SelectItem>
            {usersData?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name ?? user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Date Sort Order */}
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
