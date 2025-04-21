import type {
  RecurringType,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@acme/db";

import type { TuplifyUnion } from "~/types";

export const ROLES: TuplifyUnion<UserRole> = ["ADMIN", "USER"];
export const TASK_STATUSES: TuplifyUnion<TaskStatus> = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];
export const TASK_PRIORITIES: TuplifyUnion<TaskPriority> = [
  "LOW",
  "MEDIUM",
  "HIGH",
];
export const TASK_RECURRING_TYPES: TuplifyUnion<RecurringType> = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
];
