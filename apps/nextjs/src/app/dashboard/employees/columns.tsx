/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/Button";
import { DataTableColumnHeader } from "~/components/ui/DataTableColumnHeader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import type { EmployeeDetailsTableType } from "~/types";

export const Columns: ColumnDef<EmployeeDetailsTableType>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableGlobalFilter: false,
  },
  {
    id: "employeeImage",
    accessorKey: "User.image",
    header: "Image",
    meta: "Image",
    cell: ({ row }) => {
      const employeeImage = row.original.User.image;

      return (
        <div className="flex items-center justify-start">
          {employeeImage ? (
            <img
              className="h-14 w-14 rounded"
              src={employeeImage}
              alt="employee"
            />
          ) : (
            <IconUser className="h-14 w-14 rounded-md bg-slate-100" />
          )}
        </div>
      );
    },
    enableGlobalFilter: false,
  },
  {
    id: "employeeName",
    accessorKey: "User.name",
    meta: "Name", // for export pdf header
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableGlobalFilter: false,
  },
  {
    id: "employeeSalary",
    accessorKey: "lastSalaryAmount",
    meta: "Salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    filterFn: "fuzzy",
    enableGlobalFilter: true,
  },
  {
    id: "employeeWorkPosition",
    accessorKey: "EmployeeWorkPosition.name",
    meta: "Work Position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Work Position" />
    ),
    filterFn: "fuzzy",
    enableGlobalFilter: true,
  },
  {
    id: "employeeContactNumber",
    accessorKey: "User.contactNumber",
    meta: "Contact Number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    filterFn: "fuzzy",
    enableGlobalFilter: true,
  },
  {
    id: "employeeRole",
    accessorKey: "User.role",
    meta: "User Role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Role" />
    ),
    filterFn: "fuzzy",
    enableGlobalFilter: true,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const ctx = api.useContext();
      const router = useRouter();

      const [dialogOpened, setDialogOpened] = useState(false);
      const { mutate: deleteEmployeeMutation } =
        api.employee.deleteEmployee.useMutation();

      const handleDelete = () => {
        deleteEmployeeMutation(
          { userId: employee.User.id },
          {
            onSuccess() {
              setDialogOpened(false);
              return ctx.invalidate();
            },
          },
        );
      };

      const handleEdit = () => {
        router.replace(
          `${window.location.origin}/dashboard/employees/update-employee/${employee.User.id}`,
        );
      };

      return (
        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex cursor-pointer justify-between"
                onClick={handleEdit}
              >
                Edit <IconEdit className="h-6 w-6 text-sky-500" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer justify-between"
                onClick={() => setDialogOpened(true)}
              >
                Delete <IconTrash className="h-6 w-6 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleDelete} className="hover:bg-red-400">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
