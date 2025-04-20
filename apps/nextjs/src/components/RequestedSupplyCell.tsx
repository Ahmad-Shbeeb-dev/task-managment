import type { Dispatch, SetStateAction } from "react";
import type { Row } from "@tanstack/react-table";

import type { ChildTableType, ChildType } from "~/types";
import { Button } from "./ui/Button";

interface Props {
  row: Row<ChildTableType>;
  setRequestedSupplyOpen: Dispatch<SetStateAction<boolean>>;
  setChildSuppliesData: Dispatch<
    SetStateAction<ChildType["Child"]["ChildSupplies"] | undefined>
  >;
}
export const RequestedSupplyCell = ({
  row,
  setRequestedSupplyOpen,
  setChildSuppliesData,
}: Props) => {
  const handleCell = () => {
    setRequestedSupplyOpen(true);
    setChildSuppliesData(row.original.ChildSupplies);
  };

  const supliesCount: number = parseInt(row.getValue("requestedSupplies"));

  if (supliesCount === 0) return <p className="px-2">0</p>;

  return (
    <Button
      variant="link"
      className="font-normal hover:no-underline"
      size="xs"
      onClick={handleCell}
    >
      {supliesCount}
    </Button>
  );
};
