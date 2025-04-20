import { IconFileAnalytics, IconUserCircle } from "@tabler/icons-react";

import type { RecurringType, TaskPriority, TaskStatus } from "@acme/db";

import type { INavbarLink, RoleArray } from "~/types";

export const NAVBAR_LINKS: readonly INavbarLink[] = [
  {
    id: "home",
    path: "/dashboard/home",
    label: "Home",
    icon: <IconFileAnalytics size={20} stroke={1.5} />,
  },
  {
    id: "profile",
    path: "/dashboard/profile",
    label: "Profile",
    icon: <IconUserCircle size={20} stroke={1.5} />,
  },
] as const;

export type navbarLinkIds = (typeof NAVBAR_LINKS)[number]["id"];

export const ROLES: RoleArray = ["ADMIN", "USER"];
export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
export const TASK_RECURRING_TYPES: RecurringType[] = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
];
