import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";

import { Button } from "./Button";

export function PreviousButton({ prevPage }: { prevPage: () => void }) {
  return (
    <Button
      onClick={prevPage}
      type="button"
      className="h-8 w-24 border-4 bg-transparent text-black hover:bg-slate-100"
    >
      <IconChevronLeft className="mr-3 h-4 w-4" />
      Previous
    </Button>
  );
}
