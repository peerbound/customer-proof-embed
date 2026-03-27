import { cn } from "@/utils/cn";
import { ComponentChildren } from "preact";

interface AvatarProps {
  className?: string;
  children: ComponentChildren;
}

export const Avatar = ({ className, children }: AvatarProps) => {
  return (
    <div
      part="attribution-avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export const AvatarImage = ({ src, alt, className }: AvatarImageProps) => {
  return (
    <img
      part="attribution-avatar-image"
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
    />
  );
};
