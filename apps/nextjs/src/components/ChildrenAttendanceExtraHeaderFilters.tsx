import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { format, isSameDay, isWithinInterval, parse } from "date-fns";
import type { DateRange } from "react-day-picker";

import { api } from "~/utils/api";
import type {
  ManagerAttendancesSearchParamType,
  PeriodSelectIdType,
} from "~/utils/constants";
import {
  MANAGER_ATTENDANCES_SEARCH_PARAMS,
  PERIOD_SELECT,
} from "~/utils/constants";
import { cn } from "~/utils/ui";
import { useCustomSearchParams } from "~/hooks";
import type { ChildAttendancesTableType } from "~/types";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./ui/Button";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

export const childrenAttendanceDateFilterFiltering = (
  childrenAttendances: ChildAttendancesTableType,
  val?: Date,
) =>
  // childrenAttendances.Child.ChildAttendances.some((childAttendance) => {
  //   if (childAttendance?.checkInDate && val) {
  //     return isSameDay(childAttendance.checkInDate, val);
  //   } else {
  //     false;
  //   }
  // });
  {
    const childAttendance =
      childrenAttendances.Child.ChildAttendance?.checkInDate;
    if (childAttendance && val) {
      return isSameDay(childAttendance, val);
    } else {
      false;
    }
  };

export const childrenAttendanceDateRangeFilterFiltering = (
  childrenAttendances: ChildAttendancesTableType,
  val?: DateRange,
) => {
  const childAttendance =
    childrenAttendances.Child.ChildAttendance?.checkInDate;

  if (childAttendance && val?.from && val?.to) {
    return isWithinInterval(childAttendance, { start: val.from, end: val.to });
  } else {
    false;
  }
};

export const childrenAttendanceClassFilterFiltering = (
  childrenAttendances: ChildAttendancesTableType,
  val?: string,
) => childrenAttendances.Class.id === val;

export const childrenAttendanceTeacherFilterFiltering = (
  childrenAttendances: ChildAttendancesTableType,
  val?: string,
) =>
  childrenAttendances.Class.ClassTeachers.find(
    (classTeacher) => classTeacher.employeeId === val,
  );

interface Props {
  childrenAttendancesOriginal?: ChildAttendancesTableType[];
  setFilteredChildrenAttendances: Dispatch<
    SetStateAction<ChildAttendancesTableType[] | undefined>
  >;
  handleTableSearch: (query: string) => void;
  periodSelect: PeriodSelectIdType;
  setPeriodSelect: Dispatch<SetStateAction<PeriodSelectIdType>>;
  dateRangeFilter?: DateRange;
  setDateRangeFilter: Dispatch<SetStateAction<DateRange | undefined>>;
}

export function ChildrenAttendanceExtraHeaderFilters(props: Props) {
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [classFilter, setClassFilter] = useState<string | undefined>();
  const [teacherFilter, setTeacherFilter] = useState<string | undefined>();
  // const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(
  //   undefined,
  // );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const setQueriesString =
    useCustomSearchParams<ManagerAttendancesSearchParamType>();

  const { data: classes, isLoading: isClassesLoading } =
    api.class.getClasses.useQuery();
  const { data: teachers, isLoading: isTeachersLoading } =
    api.employee.getEmployeeTeachers.useQuery();

  const handleDateChange = (val: Date | undefined) => {
    if (props.childrenAttendancesOriginal) {
      let newFiltered = props.childrenAttendancesOriginal;

      if (val)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateFilterFiltering(original, val),
        );

      if (props.dateRangeFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateRangeFilterFiltering(
            original,
            props.dateRangeFilter,
          ),
        );

      if (classFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceClassFilterFiltering(original, classFilter),
        );

      if (teacherFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceTeacherFilterFiltering(original, teacherFilter),
        );

      router.replace(
        pathname +
          "?" +
          setQueriesString({
            keepPrevious: true,
            queries: [
              { name: "date", value: val ? format(val, "dd-MM-yyyy") : "" },
            ],
          }),
      );
      setDateFilter(val);
      props.setFilteredChildrenAttendances(newFiltered);
    }
  };

  const handleDateRangeChange = (val: DateRange | undefined) => {
    if (props.childrenAttendancesOriginal) {
      let newFiltered = props.childrenAttendancesOriginal;

      if (val)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateRangeFilterFiltering(original, val),
        );

      if (dateFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateFilterFiltering(original, dateFilter),
        );

      if (classFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceClassFilterFiltering(original, classFilter),
        );

      if (teacherFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceTeacherFilterFiltering(original, teacherFilter),
        );

      router.replace(
        pathname +
          "?" +
          setQueriesString({
            keepPrevious: true,
            queries: [
              {
                name: "dateFrom",
                value: val?.from ? format(val.from, "dd-MM-yyyy") : "",
              },
              {
                name: "dateTo",
                value: val?.to ? format(val.to, "dd-MM-yyyy") : "",
              },
            ],
          }),
      );
      props.setDateRangeFilter(val);
      props.setFilteredChildrenAttendances(newFiltered);
    }
  };

  const handleClassChange = (val: string | undefined) => {
    if (props.childrenAttendancesOriginal) {
      let newFiltered = props.childrenAttendancesOriginal;

      if (val)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceClassFilterFiltering(original, val),
        );

      if (dateFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateFilterFiltering(original, dateFilter),
        );

      if (props.dateRangeFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateRangeFilterFiltering(
            original,
            props.dateRangeFilter,
          ),
        );

      if (teacherFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceTeacherFilterFiltering(original, teacherFilter),
        );

      router.replace(
        pathname +
          "?" +
          setQueriesString({
            keepPrevious: true,
            queries: [{ name: "class", value: val ?? "" }],
          }),
      );

      setClassFilter(val);
      props.setFilteredChildrenAttendances(newFiltered);
    }
  };

  const handleTeacherChange = (val: string | undefined) => {
    if (props.childrenAttendancesOriginal) {
      let newFiltered = props.childrenAttendancesOriginal;

      if (val)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceTeacherFilterFiltering(original, val),
        );

      if (dateFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateFilterFiltering(original, dateFilter),
        );

      if (props.dateRangeFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceDateRangeFilterFiltering(
            original,
            props.dateRangeFilter,
          ),
        );

      if (classFilter)
        newFiltered = newFiltered.filter((original) =>
          childrenAttendanceClassFilterFiltering(original, classFilter),
        );

      router.replace(
        pathname +
          "?" +
          setQueriesString({
            keepPrevious: true,
            queries: [{ name: "teacher", value: val ?? "" }],
          }),
      );
      setTeacherFilter(val);
      props.setFilteredChildrenAttendances(newFiltered);
    }
  };

  // get searchParams only when mounted
  useEffect(() => {
    const params = MANAGER_ATTENDANCES_SEARCH_PARAMS.map((param) => ({
      param,
      query: searchParams.get(param),
    }));

    params.forEach(({ param, query }) => {
      if (query && query !== "") {
        if (param === "q") {
          props.handleTableSearch(query);
        }
        if (param === "class") {
          setClassFilter(query);
        }
        if (param === "teacher") {
          setTeacherFilter(query);
        }
        if (param === "date") {
          const parsedDate = parse(query, "dd-MM-yyyy", new Date());
          setDateFilter(parsedDate);
        }
        if (param === "dateFrom") {
          const parsedDate = parse(query, "dd-MM-yyyy", new Date());
          props.setDateRangeFilter((prev) => ({ ...prev, from: parsedDate }));
        }
        if (param === "dateTo") {
          const parsedDate = parse(query, "dd-MM-yyyy", new Date());
          props.setDateRangeFilter((prev) => ({
            from: prev?.from,
            to: parsedDate,
          }));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isClassesLoading || isTeachersLoading) return <LoadingSpinner />;

  return (
    // <div className="flex w-full gap-4 px-4">
    <div className="mx-0 flex w-full flex-col gap-4 px-2 xl:flex-row ">
      {/* Classes filter */}
      <div className="flex items-center gap-1">
        <Select
          key={classFilter} // force re-render to show placeholder
          value={classFilter}
          onValueChange={handleClassChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((classs) => {
              return (
                <SelectItem key={classs.id} value={classs.id}>
                  {classs.className}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <IconX
          className="h-4 w-4 cursor-pointer"
          onClick={() => handleClassChange(undefined)}
        />
      </div>

      {/* Teachers filter */}
      <div className="flex items-center gap-1">
        <Select
          key={teacherFilter} // force re-render to show placeholder
          value={teacherFilter}
          onValueChange={handleTeacherChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers?.map((teacher) => {
              return (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.User.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <IconX
          className="h-4 w-4 cursor-pointer"
          onClick={() => handleTeacherChange(undefined)}
        />
      </div>

      {/* CheckInDate filter */}
      {props.periodSelect === "day" ? (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !dateFilter && "text-muted-foreground",
                )}
              >
                {dateFilter ? (
                  format(dateFilter, "dd / MM / yyyy")
                ) : (
                  <span>DD / MM / YYYY</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                defaultMonth={dateFilter}
                onSelect={handleDateChange}
                disabled={(dateFilter) =>
                  dateFilter > new Date() || dateFilter < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <IconX
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleDateChange(undefined)}
          />
        </div>
      ) : props.periodSelect === "period" ? (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] pl-3 text-left font-normal",
                  !props.dateRangeFilter && "text-muted-foreground",
                )}
              >
                {props.dateRangeFilter?.from ? (
                  <span>
                    {format(props.dateRangeFilter.from, "dd / MM / yyyy")}
                  </span>
                ) : (
                  <span>from: DD/MM/YYYY</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                {props.dateRangeFilter?.from && props.dateRangeFilter.to ? (
                  <span className="pl-2">
                    {format(props.dateRangeFilter.to, "dd / MM / yyyy")}
                  </span>
                ) : (
                  <span className="pl-2">to: DD/MM/YYYY</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={props.dateRangeFilter?.from}
                selected={props.dateRangeFilter}
                onSelect={handleDateRangeChange}
                disabled={(dateFilter) =>
                  dateFilter > new Date() || dateFilter < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <IconX
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleDateRangeChange(undefined)}
          />
        </div>
      ) : null}

      {/* Period Select */}
      <div className="flex items-center gap-1">
        <Select
          key={props.periodSelect} // force re-render to show placeholder
          value={props.periodSelect}
          onValueChange={(val) =>
            props.setPeriodSelect(val as PeriodSelectIdType)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_SELECT?.map((period) => {
              return (
                <SelectItem key={period.id} value={period.id}>
                  {period.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
