import { Loader2Icon } from "lucide-preact";

import { cn } from "@/utils/cn";

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <Loader2Icon
      part="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
    />
  );
};
