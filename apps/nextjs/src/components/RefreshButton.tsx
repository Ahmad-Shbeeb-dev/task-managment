import { IconRefresh } from "@tabler/icons-react";
import { useIsFetching } from "@tanstack/react-query";

import { cn } from "~/utils/ui";
import { Button } from "./ui/Button";

interface Props {
  handleRefresh: () => void;
}
export const RefreshButton = ({ handleRefresh }: Props) => {
  const isFetching = useIsFetching();

  return (
    <Button
      disabled={!!isFetching}
      size="icon"
      className="h-6 w-10 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
      onClick={() => handleRefresh()}
      type="button"
    >
      <IconRefresh className={cn("", { "animate-spin": isFetching })} />
    </Button>
  );
};
