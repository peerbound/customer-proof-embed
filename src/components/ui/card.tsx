import { cn } from "@/utils/cn";
import { parseISO } from "date-fns";
import { ComponentChildren } from "preact";
import { forwardRef } from "preact/compat";

interface CardProps {
  children: ComponentChildren;
}

export const Card = ({ children }: CardProps) => {
  return (
    <div
      part="card"
      className="flex flex-col gap-5 p-card-padding rounded-card bg-background border border-border shadow-sm"
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ComponentChildren;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};

interface CardTitleProps {
  children: ComponentChildren;
}

export const CardTitle = ({ children }: CardTitleProps) => {
  return (
    <h2 part="card-title" className="text-lg font-semibold leading-snug">
      {children}
    </h2>
  );
};

interface CardTextContentProps {
  children: ComponentChildren;
}

export const CardTextContent = ({ children }: CardTextContentProps) => {
  return (
    <div part="card-text" className="flex flex-col gap-1 whitespace-pre-line">
      {children}
    </div>
  );
};

interface CardQuestionLabelProps {
  children: ComponentChildren;
}

export const CardQuestionLabel = ({ children }: CardQuestionLabelProps) => {
  return (
    <p part="card-question" className="font-semibold leading-snug">
      {children}
    </p>
  );
};

interface CardExpandableTextProps {
  children: ComponentChildren;
  isExpanded: boolean;
}

export const CardExpandableText = forwardRef<
  HTMLDivElement,
  CardExpandableTextProps
>(({ children, isExpanded }, ref) => {
  return (
    <div ref={ref} className={cn(!isExpanded && "line-clamp-12")}>
      {children}
    </div>
  );
});

interface CardFooterProps {
  onExpand?: () => void;
  date: string;
  link?: {
    text: string;
    url: string;
  };
}

export const CardFooter = ({ onExpand, date, link }: CardFooterProps) => {
  const formattedDate = Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(parseISO(date));

  return (
    <div
      part="card-footer"
      className="text-xs text-secondary flex justify-between gap-4 items-baseline h-4"
    >
      <div>
        {onExpand ? (
          <button
            part="card-expand-button"
            className="underline text-sm hover:text-primary transition-colors"
            onClick={onExpand}
          >
            Show more
          </button>
        ) : undefined}
      </div>

      <div className="text-xs">
        {link && (
          <>
            <a
              part="card-source-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {link.text}
            </a>
            {" • "}
          </>
        )}
        {formattedDate}
      </div>
    </div>
  );
};
