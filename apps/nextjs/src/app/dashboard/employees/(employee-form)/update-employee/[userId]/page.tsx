import { serverSideCallerProtected } from "@acme/api";

import { AddEmployeeForm } from "~/components/forms/employee-form/AddEmployeeForm";

interface Props {
  params: { userId: string };
}

const UpdateEmployeePage = async ({ params }: Props) => {
  const caller = await serverSideCallerProtected();
  const employeeDetails = await caller?.employee.getEmployee({
    userId: params.userId,
  });

  return (
    <AddEmployeeForm
      userIdParam={params.userId}
      initialEmployeeDetails={employeeDetails}
    />
  );
};

export default UpdateEmployeePage;
