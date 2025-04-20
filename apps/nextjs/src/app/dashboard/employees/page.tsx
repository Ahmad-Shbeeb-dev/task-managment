"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortingState } from "@tanstack/react-table";

import { api } from "~/utils/api";
import type { ManagerEmployeesSearchParamType } from "~/utils/constants";
import { MANAGER_EMPLOYEES_SEARCH_PARAMS } from "~/utils/constants";
import { Breadcrumb } from "~/components/Breadcrumb";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Button } from "~/components/ui/Button";
import { DataTable } from "~/components/ui/DataTable";
import { useCustomSearchParams } from "~/hooks";
import type { IUrlSorting } from "~/types";
import { Columns } from "./columns";

export default function ManagerEmployeePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [globalFilter, setGlobalFilter] = useState("");

  const setQueriesString =
    useCustomSearchParams<ManagerEmployeesSearchParamType>();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "employeeName", desc: false }, // set default sorting
  ]);
  const [onMountUrlSorting, setOnMountUrlSorting] = useState<IUrlSorting>({
    columnName: "",
    orderType: "",
  });

  const { data: employees, isLoading } = api.employee.getEmployees.useQuery({});

  const handleTableSearch = (query: string) => {
    router.replace(
      pathname +
        "?" +
        setQueriesString({
          keepPrevious: true,
          queries: [{ name: "q", value: query }],
        }),
    );

    setGlobalFilter(query);
  };

  // get searchParams only when mounted
  useEffect(() => {
    const params = MANAGER_EMPLOYEES_SEARCH_PARAMS.map((param) => ({
      param,
      query: searchParams.get(param),
    }));

    params.forEach(({ param, query }) => {
      if (query && query !== "") {
        if (param === "q") {
          handleTableSearch(query);
        }
        if (param === "orderBy") {
          setOnMountUrlSorting((prev) => ({
            ...prev,
            columnName: query,
          }));
        }
        if (param === "orderType") {
          setOnMountUrlSorting((prev) => ({
            ...prev,
            orderType: query,
          }));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!employees || isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex items-center justify-between px-10 py-3">
        <Breadcrumb />
        <Button asChild className="bg-[#95D354] hover:bg-[#84b84c]">
          <Link href="/dashboard/employees/add-employee">Add New Employee</Link>
        </Button>
      </div>
      <div className="bg-white p-10 pt-0">
        <DataTable
          columns={Columns}
          data={employees}
          handleSearch={handleTableSearch}
          searchPlaceholder="Search..."
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
          onMountUrlSorting={onMountUrlSorting}
        />
      </div>
    </>
  );
}
