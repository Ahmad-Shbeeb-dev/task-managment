"use client";

import { useState } from "react";

import { api } from "~/utils/api";
import type { EmployeeDetailsType, SelectedClassState } from "~/types";
import { LoadingSpinner } from "./LoadingSpinner";
import { ProfileLeftSection } from "./ProfileLeftSection";
import { ProfileRightSection } from "./ProfileRightSection";

interface Props {
  initialEmployeeDetails: EmployeeDetailsType;
}
export const Profile = ({ initialEmployeeDetails }: Props) => {
  const [selectedClass, setSelectedClass] = useState<
    SelectedClassState | undefined
  >({
    id: initialEmployeeDetails?.Employee?.ClassTeachers.at(0)?.Class.id,
    name: initialEmployeeDetails?.Employee?.ClassTeachers.at(0)?.Class
      .className,
  });

  const { data: employeeDetails, isLoading } =
    api.employee.getEmployee.useQuery(
      { currentUser: true, classId: selectedClass?.id },
      {
        // IMPORTANT: initialData is persisted to the cache, so it is not recommended to provide placeholder, partial or incomplete data to this option and instead use placeholderData
        placeholderData: initialEmployeeDetails,
      },
    );

  if (!employeeDetails || isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-row items-start justify-between">
      <div className="h-full flex-grow items-center justify-center bg-white px-5 py-10 shadow-md">
        <ProfileLeftSection
          employeeDetails={employeeDetails}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
      </div>

      <ProfileRightSection
        employeeDetails={employeeDetails}
        selectedClass={selectedClass}
      />
    </div>
  );
};
