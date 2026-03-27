import { PublicEvent } from "@/lib/schemas";
import { useMasonryLayout } from "../hooks/useMasonryLayout";
import { forwardRef, HTMLAttributes } from "preact/compat";
import { cn } from "@/utils/cn";
import { EventCard } from "./EventCard";
import { ImageProvider } from "../providers/ImageProvider";
import { EventImages } from "@/lib/images";

interface ProofGridProps {
  events: PublicEvent[];
  imagesByEventId: Map<string, EventImages>;
}

export const ProofGrid = ({ events, imagesByEventId }: ProofGridProps) => {
  const { columns, measureContainerRef } = useMasonryLayout(events);

  return (
    <div className="relative w-full">
      {/* Hidden measurement container: renders all moments in a single column
      to calculate their actual heights for masonry layout distribution */}
      <div
        ref={measureContainerRef}
        aria-hidden="true"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid pointer-events-none invisible absolute left-0 h-0 overflow-hidden"
      >
        <Column ref={measureContainerRef}>
          {events.map((event) => (
            <ImageProvider
              key={`${event.event_type}_${event.id}`}
              images={imagesByEventId.get(event.id) ?? {}}
            >
              <EventCard event={event} />
            </ImageProvider>
          ))}
        </Column>
      </div>

      <div
        // Use CSS grid instead of flexbox to ensure uniform column widths
        className="grid gap-grid"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((columnEvents, index) => (
          <Column key={index}>
            {columnEvents.map((event) => (
              <ImageProvider
                key={`${event.event_type}_${event.id}`}
                images={imagesByEventId.get(event.id) ?? {}}
              >
                <EventCard event={event} />
              </ImageProvider>
            ))}
          </Column>
        ))}
      </div>
    </div>
  );
};

type ColumnProps = HTMLAttributes<HTMLDivElement>;

const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-grid", className)}
        {...props}
      />
    );
  },
);
