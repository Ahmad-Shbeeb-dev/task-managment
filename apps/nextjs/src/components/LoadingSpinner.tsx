import { IconFidgetSpinner } from "@tabler/icons-react";

export const LoadingSpinner = () => {
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center">
        <IconFidgetSpinner
          className="h-20 w-20 animate-spin"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
