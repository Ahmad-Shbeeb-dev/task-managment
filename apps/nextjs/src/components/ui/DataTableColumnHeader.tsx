"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  IconArrowDown,
  IconArrowUp,
  IconEye,
  IconFilter,
} from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";

import type { TeacherChildrenSearchParamType } from "~/utils/constants";
import { cn } from "~/utils/ui";
import { useCustomSearchParams, useForceUpdate } from "~/hooks";
import { Button } from "./Button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  hide?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  hide,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const setQueriesString =
    useCustomSearchParams<TeacherChildrenSearchParamType>();

  const handleSorting = (toggle: boolean) => {
    column.toggleSorting(toggle);
    router.replace(
      pathname +
        "?" +
        setQueriesString({
          keepPrevious: true,
          queries: [
            { name: "orderBy", value: column.id },
            { name: "orderType", value: toggle ? "dsc" : "asc" },
          ],
        }),
    );
  };

  if (hide) {
    column.toggleVisibility(false);
    return null;
  }
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconFilter className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rounded-md bg-slate-100">
          <DropdownMenuItem onClick={() => handleSorting(false)}>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100/50">
              <IconArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
              Asc
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSorting(true)}>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100/50">
              <IconArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
              Desc
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100/50">
              <IconEye className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
              Hide
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
