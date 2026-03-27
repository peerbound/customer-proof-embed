import { cn } from "@/utils/cn";

interface AccountLogoProps {
  src: string;
  alt: string;
  size?: "sm" | "lg";
  className?: string;
}

export const AccountLogo = ({
  src,
  alt,
  size = "sm",
  className,
}: AccountLogoProps) => {
  return (
    <div
      part="attribution-account-logo"
      className={cn(
        "flex items-center justify-center rounded overflow-hidden bg-background shrink-0",
        size === "sm" ? "size-4.5 p-px" : "size-14 p-0.5",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "size-full object-contain",
          size === "sm" ? "rounded" : "rounded-md",
        )}
      />
    </div>
  );
};
