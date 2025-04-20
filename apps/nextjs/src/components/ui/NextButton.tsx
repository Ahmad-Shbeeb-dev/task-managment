import React from "react";
import { IconChevronRight } from "@tabler/icons-react";

import { Button } from "./Button";

export function NextButton({ nextPage }: { nextPage: () => void }) {
  return (
    <Button
      onClick={nextPage}
      type="button"
      className="h-8 w-24 bg-green-400 hover:cursor-pointer hover:bg-green-400"
    >
      Next <IconChevronRight className="ml-3 h-4 w-4" />
    </Button>
  );
}
