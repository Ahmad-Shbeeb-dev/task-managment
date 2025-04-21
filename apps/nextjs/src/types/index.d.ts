import type { RouterOutputs } from "@acme/api";

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

// Infer the output type for a single task
export type TaskOutput = RouterOutputs["task"]["getAll"]["tasks"][number];
