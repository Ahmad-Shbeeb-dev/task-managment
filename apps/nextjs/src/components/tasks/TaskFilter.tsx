"use client";

import type { TaskStatus } from "@acme/db";

import { STATUS_FILTER_OPTIONS } from "~/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";

interface TaskFilterProps {
  value: TaskStatus | "ALL";
  onChange: (value: string) => void;
}

export const TaskFilter = ({ value, onChange }: TaskFilterProps) => {
  return (
    <div className="flex justify-end">
      <Select value={value} onValueChange={onChange}>
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
  );
};
