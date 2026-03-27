import { cn } from "@/utils/cn";
import { HTMLAttributes } from "preact/compat";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

export const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-white hover:bg-primary/90": variant === "default",
          "border bg-card hover:bg-accent": variant === "outline",
          "h-9 px-4 py-2": size === "default",
          "h-8 px-3": size === "sm",
        },
        className,
      )}
      {...props}
    />
  );
};
