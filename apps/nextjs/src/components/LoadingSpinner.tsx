import { cn } from "~/utils/ui";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  className,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    xs: "h-3 w-3 border-[1.5px]",
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  const spinnerComponent = (
    <div
      className={cn(
        "relative",
        fullScreen && "flex h-full items-center justify-center",
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-transparent",
          sizeClasses[size],
          "border-b-blue-600 dark:border-b-blue-400",
          className,
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 animate-pulse rounded-full border-transparent opacity-75",
          sizeClasses[size],
          "border-t-blue-600 dark:border-t-blue-400",
          className,
        )}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {spinnerComponent}
      </div>
    );
  }

  return spinnerComponent;
};
