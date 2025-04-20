import type { z } from "zod";

import type { RouterOutputs } from "@acme/api";
import type { upsertEmployeeValidation } from "@acme/api/validations";
import type { UserRole } from "@acme/db";

//TuplifyUnion type will convert union type to array of the union to make sure all types are in-sync between the prisma schema and front-end
type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
type LastOf<T> =
  UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
    ? R
    : never;
type Push<T extends unknown[], V> = [...T, V];

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

// export type UserRole = RouterInputs["user"]["updateRole"][number]["userRole"];

// convert Role type defined on input from prisma schema enum to RoleArray
export type Role = UserRole;
export type RoleArray = TuplifyUnion<UserRole>;

export interface INavbarLink {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly icon?: JSX.Element;
  readonly roles?: readonly Role[];
  readonly subLinks?: readonly INavbarLink[];
}

export interface IUrlSorting {
  columnName: string;
  orderType: string;
}

export type ImageCategory =
  | "childAttachment"
  | "childVaccine"
  | "childImage"
  | "employeeAttachment";

//Attendances
export type ChildAttendancesTableType =
  RouterOutputs["child"]["getChildrenAttendances"][number];
export type EmployeeAttendancesTableType =
  RouterOutputs["employee"]["getEmployeesAttendances"][number];

// Employees
export type EmployeeDetailsTableType =
  RouterOutputs["employee"]["getEmployees"][number];
export type EmployeeFormInputsType = z.infer<typeof upsertEmployeeValidation>;

// Infer the output type for a single task
export type TaskOutput = RouterOutputs["task"]["getAll"]["tasks"][number];
