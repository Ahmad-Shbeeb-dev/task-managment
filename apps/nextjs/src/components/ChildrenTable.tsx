import React from "react";
import { IconDotsVertical } from "@tabler/icons-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";

const ChildrenTable = () => {
  const data = [
    {
      id: 1,
      photo: "https://picsum.photos/id/338/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 2,
      photo: "https://picsum.photos/id/339/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 3,
      photo: "https://picsum.photos/id/340/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 4,
      photo: "https://picsum.photos/id/341/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 4,
      photo: "https://picsum.photos/id/341/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 4,
      photo: "https://picsum.photos/id/341/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 4,
      photo: "https://picsum.photos/id/341/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
    {
      id: 4,
      photo: "https://picsum.photos/id/341/40",
      name: "Child 1",
      birthDate: "1-8-2020",
      motherName: "Mother 1",
      motherNumber: "123456789",
      registerDate: "1-8-2021",
    },
  ];

  return (
    <Table>
      {/* <TableCaption className="pt-4 text-left">Showing</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Photo</TableHead>
          <TableHead>Child Name (en)</TableHead>
          <TableHead>Date Of Birth</TableHead>
          <TableHead>Mother&apos;s Name</TableHead>
          <TableHead>Mother&apos;s Phone Number</TableHead>
          <TableHead>Register Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((child, index) => {
          const isOddRow = index % 2 === 0; // Check if the row is odd

          return (
            <TableRow
              key={child.id}
              className={isOddRow ? "bg-gray-200" : ""} // Apply different background color to odd rows
            >
              <TableCell className="font-medium">{child.id}</TableCell>
              <TableCell>
                <img className="rounded" src={child.photo} alt="child" />
              </TableCell>
              <TableCell>{child.name}</TableCell>
              <TableCell>{child.birthDate}</TableCell>
              <TableCell>{child.motherName}</TableCell>
              <TableCell>{child.motherNumber}</TableCell>
              <TableCell>{child.registerDate}</TableCell>
              <TableCell>
                <IconDotsVertical style={{ cursor: "pointer" }} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ChildrenTable;
