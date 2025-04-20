import { format } from "date-fns";

import { cn } from "~/utils/ui";
import { Button } from "./ui/Button";

interface Props {
  checkOutDate?: Date | null;
  checkInDate?: Date | null;
  handleCheckOut: () => void;
}
export const CheckOutButton = ({
  checkOutDate,
  checkInDate,
  handleCheckOut,
}: Props) => {
  return checkOutDate ? (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "mb-4 h-7 w-4/5 border-pink-400 font-medium text-pink-600 hover:bg-pink-400/50 hover:text-pink-600",
      )}
    >
      {format(checkOutDate, "hh:mm a")}
    </Button>
  ) : checkInDate ? (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCheckOut}
      className={cn(
        "mb-4 h-7 w-4/5 border-none bg-pink-400 font-medium text-white hover:bg-pink-400/50 hover:text-white",
      )}
    >
      Check Out
    </Button>
  ) : null;
};
