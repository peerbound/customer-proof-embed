import { cn } from "@/utils/cn";
import { StarIcon } from "lucide-preact";
import { ComponentChildren } from "preact";

interface ReviewHeadingProps {
  children: ComponentChildren;
}

export const ReviewHeading = ({ children }: ReviewHeadingProps) => {
  return (
    <div part="review-heading" className="flex flex-col gap-2">
      {children}
    </div>
  );
};

interface ReviewStarsProps {
  starRating: number;
}

export const ReviewStars = ({ starRating }: ReviewStarsProps) => {
  // Clamp rating between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, starRating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-stars">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <ReviewStar key={`full-${index}`} className="fill-current" />
      ))}

      {hasHalfStar && (
        <div>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <StarIcon fill="url(#halfStarGradient)" className="size-star" />
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <ReviewStar key={`empty-${index}`} />
      ))}
    </div>
  );
};

interface ReviewStarProps {
  className?: string;
}

export const ReviewStar = ({ className }: ReviewStarProps) => {
  return <StarIcon className={cn("size-star", className)} />;
};
