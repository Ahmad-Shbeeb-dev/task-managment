import {
  IconFileAnalytics,
  IconHorseToy,
  IconMilk,
  IconMoon,
  IconNotebook,
  IconSettings,
  IconShirtSport,
  IconUserCircle,
} from "@tabler/icons-react";

import type { RecurringType, TaskPriority, TaskStatus } from "@acme/db";

import type { INavbarLink, Role, RoleArray } from "~/types";

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
  {
    id: "tasks",
    path: "/dashboard/tasks",
    label: "Tasks",
    icon: <IconHorseToy size={20} stroke={1.5} />,
  },
  {
    id: "admin",
    path: "/dashboard/admin",
    label: "Admin",
    icon: <IconSettings size={20} stroke={1.5} />,
    roles: ["ADMIN"],
  },
  // {
  //   id: "reports",
  //   label: "Reports",
  //   path: "/dashboard/reports/",
  //   icon: <IconFileAnalytics size={20} stroke={1.5} />,
  //   subLinks: [
  //     {
  //       id: "supplies",
  //       path: "/dashboard/reports/supplies",
  //       label: "Supplies",
  //       icon: <IconShoppingCart size={20} stroke={1.5} />,
  //     },
  //   ],
  // },
] as const;

export type navbarLinkIds = (typeof NAVBAR_LINKS)[number]["id"];

export const childSupplyIcons = {
  sleep: <IconMoon size={20} stroke={1.5} />,
  food: <IconMilk size={20} stroke={1.5} />,
  clothes: <IconShirtSport size={20} stroke={1.5} />,
  books: <IconNotebook size={20} stroke={1.5} />,
};

export const EVENT_COLORS = [
  "#FC7FB9",
  "#6A5CF7",
  "#F5DB70",
  "#43B0EE",
] as const;

export const TEACHER_CHILDREN_SEARCH_PARAMS = [
  "childMotherName",
  "orderBy",
  "orderType",
] as const;

export type TeacherChildrenSearchParamType =
  (typeof TEACHER_CHILDREN_SEARCH_PARAMS)[number];

export const EVENT_SEARCH_PARAMS = [
  "itemName",
  "orderBy",
  "orderType",
] as const;

export type EventSearchParams = (typeof EVENT_SEARCH_PARAMS)[number];

export const TEACHER_REPORT_SUPPLY_SEARCH_PARAMS = [
  "supplyChildName",
  "orderBy",
  "orderType",
] as const;

export type TeacherReportSupplySearchParamType =
  (typeof TEACHER_REPORT_SUPPLY_SEARCH_PARAMS)[number];

export const TEACHER_HOME_SEARCH_PARAMS = [
  "childNameEn",
  "classId",
  "checkedIn",
] as const;

export type TeacherHomeSearchParamType =
  (typeof TEACHER_HOME_SEARCH_PARAMS)[number];

export const MANAGER_ANNOUNCEMENTS_SEARCH_PARAMS = [
  "q",
  "orderBy",
  "orderType",
] as const;

export type ManagerAnnouncementsSearchParamType =
  (typeof MANAGER_ANNOUNCEMENTS_SEARCH_PARAMS)[number];

export const MANAGER_EMPLOYEES_SEARCH_PARAMS = [
  "q",
  "orderBy",
  "orderType",
] as const;

export type ManagerEmployeesSearchParamType =
  (typeof MANAGER_EMPLOYEES_SEARCH_PARAMS)[number];

export const MANAGER_ATTENDANCES_SEARCH_PARAMS = [
  "q",
  "class",
  "teacher",
  "date",
  "dateFrom",
  "dateTo",
  "workPosition",
  "orderBy",
  "orderType",
] as const;

export type ManagerAttendancesSearchParamType =
  (typeof MANAGER_ATTENDANCES_SEARCH_PARAMS)[number];

export const PERIOD_SELECT = [
  { id: "day", label: "Day" },
  { id: "period", label: "Specific Period" },
] as const;

export type PeriodSelectIdType = (typeof PERIOD_SELECT)[number]["id"];

export const ROLES: RoleArray = ["ADMIN", "USER"];
export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
export const TASK_RECURRING_TYPES: RecurringType[] = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
];
