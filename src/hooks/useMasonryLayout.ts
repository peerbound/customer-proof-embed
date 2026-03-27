import { PublicEvent } from "@/lib/schemas";
import { useCallback, useLayoutEffect, useRef, useState } from "preact/hooks";

const CARD_GAP_PX = 32;

// Responsive breakpoints for column count based on container width
export const getColumnCount = (width: number): number => {
  if (width >= 1280) return 4; // xl
  if (width >= 1024) return 3; // lg
  if (width >= 640) return 2; // sm
  return 1;
};

// Groups events into columns based on their assigned column indices
export const buildColumns = (
  events: PublicEvent[],
  columnAssignments: number[],
): PublicEvent[][] => {
  if (columnAssignments.length === 0) {
    return [];
  }

  const numColumns = Math.max(...columnAssignments) + 1;
  const columns: PublicEvent[][] = Array.from({ length: numColumns }, () => []);

  for (let i = 0; i < events.length; i++) {
    const colIndex = columnAssignments[i];
    columns[colIndex].push(events[i]);
  }

  return columns;
};

/**
 * Hook for creating a masonry layout that distributes items across columns
 * by always placing the next item in the shortest column.
 */
export const useMasonryLayout = (events: PublicEvent[]) => {
  const [columns, setColumns] = useState<PublicEvent[][]>([]);

  // Hidden container used to measure width and item heights
  const measureContainerRef = useRef<HTMLDivElement>(null);

  const computeAssignments = useCallback(() => {
    if (!measureContainerRef.current) return;

    const width = measureContainerRef.current.offsetWidth;
    const numColumns = getColumnCount(width);

    const column = measureContainerRef.current.children[0];
    const measureChildren = column.children;

    const columnHeights = Array(numColumns).fill(0);
    const assignments = [];

    for (let i = 0; i < events.length; i++) {
      const itemHeight = measureChildren[i].getBoundingClientRect().height;
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );

      assignments.push(shortestColumnIndex);
      columnHeights[shortestColumnIndex] += itemHeight + CARD_GAP_PX;
    }

    setColumns(buildColumns(events, assignments));
  }, [events]);

  useLayoutEffect(() => {
    if (!measureContainerRef.current) return;

    computeAssignments();

    // Set up ResizeObserver for window resizes
    // Use RAF for resize events to batch frequent resize callbacks
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        computeAssignments();
      });
    });

    resizeObserver.observe(measureContainerRef.current);

    return () => resizeObserver.disconnect();
  }, [computeAssignments]);

  return {
    columns,
    measureContainerRef,
  };
};
