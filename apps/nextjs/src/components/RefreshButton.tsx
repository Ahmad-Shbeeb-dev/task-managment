import { IconRefresh } from "@tabler/icons-react";
import { useIsFetching } from "@tanstack/react-query";

import { cn } from "~/utils/ui";
import { Button } from "./ui/Button";

interface Props {
  handleRefresh: () => void;
  className?: string;
}
export const RefreshButton = ({ handleRefresh, className }: Props) => {
  const isFetching = useIsFetching();

  return (
    <Button
      disabled={!!isFetching}
      size="icon"
      className={cn(
        "h-6 w-10 bg-transparent text-gray-300/75 hover:bg-transparent hover:text-gray-300/40",
        className,
      )}
      onClick={() => handleRefresh()}
      type="button"
    >
      <IconRefresh className={cn("", { "animate-spin": isFetching })} />
    </Button>
  );
};
