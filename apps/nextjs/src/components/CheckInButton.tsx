import { format } from "date-fns";

import { cn } from "~/utils/ui";
import { Button } from "./ui/Button";

interface Props {
  checkInDate?: Date | null;
  handleCheckIn: () => void;
}
export const CheckInButton = ({ checkInDate, handleCheckIn }: Props) => {
  return checkInDate ? (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "mb-4 h-7 w-4/5 border-lime-400 font-medium text-lime-700  hover:bg-lime-400/50 hover:text-lime-600",
      )}
    >
      {format(checkInDate, "hh:mm a")}
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCheckIn}
      className={cn(
        "mb-4 h-7 w-4/5 border-none bg-lime-500/75  font-medium text-white hover:bg-lime-500/50 hover:text-white",
      )}
    >
      Check In
    </Button>
  );
};
