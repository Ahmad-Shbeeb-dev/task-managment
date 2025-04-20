"use client";

import {
  IconCalendarEvent,
  IconCameraPlus,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";

import { api } from "~/utils/api";
import type { EmployeeDetailsType, SelectedClassState } from "~/types";
import { CheckInButton } from "./CheckInButton";
import { CheckOutButton } from "./CheckOutButton";
import { Events } from "./Events";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

interface Props {
  employeeDetails: EmployeeDetailsType;
  selectedClass?: SelectedClassState;
}
export const ProfileRightSection = ({
  employeeDetails,
  selectedClass,
}: Props) => {
  const ctx = api.useContext();

  const { mutate: checkInEmployeeMutation } =
    api.employee.checkInEmployee.useMutation({
      onSuccess: async () => {
        await ctx.employee.getEmployee.invalidate();
      },
    });

  const { mutate: checkOutEmployeeMutation } =
    api.employee.checkOutEmployee.useMutation({
      onSuccess: async () => {
        await ctx.employee.getEmployee.invalidate();
      },
    });

  const todayAttendance = employeeDetails?.Employee?.EmployeeAttendances.at(0);
  const handleCheckIn = () => {
    if (selectedClass?.id)
      checkInEmployeeMutation({ classId: selectedClass.id });
  };

  const handleCheckOut = () => {
    if (todayAttendance?.id)
      checkOutEmployeeMutation({ attendanceId: todayAttendance.id });
  };
  return (
    <div className="mt-8 flex h-screen w-[320px] flex-col items-center justify-center gap-4 p-5">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 hover:cursor-pointer">
          <AvatarImage
            src={employeeDetails?.image ?? undefined}
            alt="user-image"
          />
          <AvatarFallback className="group flex flex-col items-center justify-center bg-slate-200">
            <IconUser className="h-10 w-10" />
            <div className="-mb-4 hidden w-full justify-center p-1 group-hover:flex group-hover:bg-slate-600/50">
              <IconCameraPlus className="h-5 w-5 text-white" />
            </div>
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold">{employeeDetails?.name}</p>
        <p className="text-sm text-slate-400">{selectedClass?.name}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <IconMail />
          <p className="text-sm ">Email: {employeeDetails?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <IconPhone />
          <p className="text-sm ">Number: {employeeDetails?.contactNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendarEvent />
          <p className="text-sm ">
            Date of Birth:{" "}
            {employeeDetails?.dateOfBirth &&
              format(employeeDetails.dateOfBirth, "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      {/* {selectedClass?.id && (
        <div className="flex w-full justify-center gap-2">
          <CheckInButton
            checkInDate={todayAttendance?.checkInDate}
            handleCheckIn={handleCheckIn}
          />

          <CheckOutButton
            checkInDate={todayAttendance?.checkInDate}
            checkOutDate={todayAttendance?.checkOutDate}
            handleCheckOut={handleCheckOut}
          />
        </div>
      )} */}

      <Events isAdd={false} events={employeeDetails.todayEvents} />
    </div>
  );
};
