import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { logError } from "@/utils/logger";

export type PaginationState = "idle" | "loading" | "error";

interface PaginationControlsProps {
  paginationState: PaginationState;
  onLoadMore: () => void;
}

export const PaginationControls = ({
  paginationState,
  onLoadMore,
}: PaginationControlsProps) => {
  switch (paginationState) {
    case "idle":
      return (
        <Button
          part="load-more-button"
          size="sm"
          variant="outline"
          onClick={onLoadMore}
          className="rounded-full"
        >
          See more
        </Button>
      );

    case "loading":
      return <Spinner className="size-6 text-secondary" />;

    case "error":
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-secondary">Something went wrong.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMore}
            className="rounded-full"
          >
            Retry?
          </Button>
        </div>
      );

    default: {
      const unhandledPaginationState: never = paginationState;
      logError(
        `Unhandled pagination state: ${JSON.stringify(unhandledPaginationState)}`,
      );
    }
  }
};
