import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string | null) {
  if (!str) str = "";
  // Remove all underscores first
  const noUnderscores = str.replace(/_/g, " ");

  // Capitalize first letter and lowercase the rest
  return (
    noUnderscores.charAt(0).toUpperCase() + noUnderscores.slice(1).toLowerCase()
  );
}
