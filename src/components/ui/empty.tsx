import { cn } from "@/utils/cn";
import { ComponentChildren } from "preact";

interface EmptyProps {
  children: ComponentChildren;
  className?: string;
}

export const Empty = ({ children, className }: EmptyProps) => {
  return (
    <div
      part="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6 text-center text-balance md:p-12",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface EmptyHeaderProps {
  children: ComponentChildren;
  className?: string;
}

export const EmptyHeader = ({ children, className }: EmptyHeaderProps) => {
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface EmptyTitleProps {
  children: ComponentChildren;
  className?: string;
}

export const EmptyTitle = ({ children, className }: EmptyTitleProps) => {
  return (
    <div
      part="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
    >
      {children}
    </div>
  );
};

interface EmptyDescriptionProps {
  children: ComponentChildren;
  className?: string;
}

export const EmptyDescription = ({
  children,
  className,
}: EmptyDescriptionProps) => {
  return (
    <div
      part="empty-description"
      className={cn("text-secondary text-sm/relaxed", className)}
    >
      {children}
    </div>
  );
};
