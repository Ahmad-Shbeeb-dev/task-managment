"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconDotsVertical, IconTrash, IconUserPlus } from "@tabler/icons-react";

import { api } from "~/utils/api";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Button } from "~/components/ui/Button";
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

export default function ManagerEmployeeFormLayout(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  const { mutate: deleteEmployeeMutation } =
    api.employee.deleteEmployee.useMutation();

  const handleAddNew = () => {
    router.replace(
      `${window.location.origin}/dashboard/employees/add-employee`,
    );
  };

  const handleDelete = () => {
    const pathParts = pathName.split("/");
    const userIdParam = pathParts[pathParts.length - 1];

    if (userIdParam) {
      setDialogOpened(false);
      deleteEmployeeMutation(
        { userId: userIdParam },
        {
          onSuccess() {
            router.replace(
              `${window.location.origin}/dashboard/employees/add-employee`,
            );
          },
        },
      );
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-10 py-3">
        <Breadcrumb />

        {pathName.includes("update-employee") && (
          <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60">
                <IconDotsVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex cursor-pointer justify-between"
                  onClick={handleAddNew}
                >
                  Add New <IconUserPlus className="h-6 w-6 text-[#42B4FF]" />
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
        )}
      </div>
      <div className="bg-white p-6 pt-3">{props.children}</div>
    </>
  );
}
