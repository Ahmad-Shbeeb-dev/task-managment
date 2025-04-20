/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { RankingInfo } from "@tanstack/match-sorter-utils";
import { rankItem } from "@tanstack/match-sorter-utils";
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  RowData,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import "@tanstack/match-sorter-utils";

import { IconFileTypePdf, IconFilter } from "@tabler/icons-react";
import { useIsFetching } from "@tanstack/react-query";
import { format, isValid, parse } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { nanoid } from "nanoid";

import { api } from "~/utils/api";
import { NotoSansArabic } from "~/utils/UnicodeArabicFont-jspdf";
import type { ChildType, IUrlSorting } from "~/types";
import { LoadingSpinner } from "../LoadingSpinner";
import { RefreshButton } from "../RefreshButton";
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { Input } from "./Input";
import { ScrollArea, ScrollBar } from "./ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

// passed to cells via table.options.meta
interface meta {
  setRequestedSupplyOpen?: Dispatch<SetStateAction<boolean>>;
  setChildSuppliesData?: Dispatch<
    SetStateAction<ChildType["Child"]["ChildSupplies"] | undefined>
  >;
}

interface DataTableProps<TData, TValue> extends meta {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleSearch: (query: string) => void;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  sorting: SortingState;
  searchPlaceholder: string;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  onMountUrlSorting: IUrlSorting;
  showExportPdf?: boolean;
  extraHeaderFilters?: JSX.Element;
}
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }

  interface TableMeta<TData extends RowData> extends meta {}
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//   let dir = 0;

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank!,
//       rowB.columnFiltersMeta[columnId]?.itemRank!,
//     );
//   }

//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
// };

export function DataTable<TData, TValue>({
  columns,
  data,
  setRequestedSupplyOpen,
  setChildSuppliesData,
  handleSearch,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  onMountUrlSorting,
  searchPlaceholder,
  showExportPdf,
  extraHeaderFilters,
}: DataTableProps<TData, TValue>) {
  const isFetching = useIsFetching();
  const ctx = api.useContext();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    meta: { setRequestedSupplyOpen, setChildSuppliesData },
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    enableGlobalFilter: true,
    enableFilters: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // debugAll: true,
  });

  useEffect(() => {
    if (
      onMountUrlSorting.columnName !== "" &&
      onMountUrlSorting.orderType !== ""
    ) {
      table
        .getAllColumns()
        .filter(
          (column) =>
            column.getCanSort() && column.id === onMountUrlSorting.columnName,
        )
        .map((column) => {
          column.toggleSorting(onMountUrlSorting.orderType === "dsc");
        });
    }
  }, [onMountUrlSorting]);

  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("NotoSansArabic-Regular-normal.ttf", NotoSansArabic);
    doc.addFont(
      "NotoSansArabic-Regular-normal.ttf",
      "NotoSansArabic-Regular",
      "normal",
    );
    doc.setFont("NotoSansArabic-Regular", "normal");

    const rows = table.getPrePaginationRowModel().rows; //export all rows, including from the next page, (still respects filtering and sorting)

    const visibleHeaders = table
      .getAllColumns()
      .filter(
        (column) => column.getIsVisible() && column.id !== "image", //remove image column
      )
      .map((column) => column.id);

    const tableColumns = columns
      .filter(
        (column) =>
          column.id && column.meta && visibleHeaders.includes(column.id),
      )
      .map((column) => column);

    const tableHeaders = tableColumns.map((column) => column.meta);
    const tableArHeadersObject = tableHeaders.reduce(
      (acc, header, index) =>
        // @ts-ignore
        header?.includes("ar")
          ? { ...acc, [index]: { font: "NotoSansArabic-Regular" } }
          : acc,
      {},
    );

    const tableData = rows.map((row) =>
      // @ts-ignore
      visibleHeaders.map((columnId) => {
        const cellValue = row.getValue(columnId);
        if (cellValue && isValid(cellValue)) {
          const formattedDate = format(cellValue as Date, "dd/MM/yyyy hh:mm a");
          return formattedDate;
        }
        return cellValue;
      }),
    );

    autoTable(doc, {
      // @ts-ignore
      head: [tableHeaders],
      // @ts-ignore
      body: tableData,
      ...(tableArHeadersObject && { columnStyles: tableArHeadersObject }), //print the column in arabic only if there is header contains "ar"
    });

    doc.save(`${format(new Date(), "dd/MM/yyyy hh:mm:ss a")}.pdf`);
  };

  return (
    <div className="flex flex-col">
      {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}

      <div className="flex flex-row items-center justify-between py-4">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="" type="button">
                <IconFilter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="rounded-md data-[state=open]:bg-slate-100"
            >
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide() && column.columnDef.meta,
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {showExportPdf && (
            <Button
              onClick={handleExportPdf}
              size="icon"
              variant="ghost"
              type="button"
            >
              <IconFileTypePdf />
            </Button>
          )}
        </div>

        {extraHeaderFilters}

        <div className="mt-4 flex w-96   items-center xl:mt-0">
          <p className="ml-auto w-24 text-sm text-slate-400">
            {table.getFilteredRowModel().rows.length} Results
          </p>
          {/* <DebouncedInput
            debounce={0}
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="ml-auto w-3/4 max-w-xs"
            placeholder="Search Child, Mother"
          /> */}
          {/* <Input
          placeholder="Search Child"
          value={
            (table.getColumn("childNameEn")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("childNameEn")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
          <Input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => handleSearch(String(e.target.value))}
            className="ml-auto w-3/4 max-w-xs"
            placeholder={searchPlaceholder}
          />

          {/* Invalidate current page queries */}
          <RefreshButton handleRefresh={() => ctx.invalidate()} />
        </div>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <div>
          <ScrollArea className="max-w-screen whitespace-nowrap rounded-md border-2">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="ghost"
              className="rounded border p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              type="button"
            >
              {"<<"}
            </Button>
            <Button
              variant="ghost"
              className="rounded border p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              type="button"
            >
              {"<"}
            </Button>
            <Button
              variant="ghost"
              className="rounded border p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              type="button"
            >
              {">"}
            </Button>
            <Button
              variant="ghost"
              className="rounded border p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              type="button"
            >
              {">>"}
            </Button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <Input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-10 rounded border"
              />
            </span>

            <Select
              defaultValue={table.getState().pagination.pageSize.toString()}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40].map((pageSize) => (
                  <SelectItem key={nanoid()} value={pageSize.toString()}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
