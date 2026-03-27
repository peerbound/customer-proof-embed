import { useEffect, useState } from "preact/hooks";
import { fetchEventsAndImages } from "./lib/api";
import { PublicEvent, PublicOrganization } from "@/lib/schemas";
import { ProofGrid } from "./components/ProofGrid";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "./components/ui/empty";
import { Spinner } from "./components/ui/spinner";
import { EventImages } from "@/lib/images";
import {
  PaginationControls,
  type PaginationState,
} from "./components/PaginationControls";
import type { EmbedOptions } from "./lib/options";
import { SchemaMarkup } from "./components/SchemaMarkup";
import Logo from "./assets/logo.svg?react";
import { logError } from "@/utils/logger";

type State =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "success";
      organization: PublicOrganization;
      events: PublicEvent[];
      nextCursor: string | null;
      imagesByEventId: Map<string, EventImages>;
    };

interface AppProps {
  options?: EmbedOptions;
}

export const App = ({ options }: AppProps) => {
  const hasValidationError = !options;

  const [state, setState] = useState<State>(
    hasValidationError ? { status: "error" } : { status: "loading" },
  );
  const [paginationState, setPaginationState] =
    useState<PaginationState>("idle");

  useEffect(() => {
    if (!options) return;

    const initialize = async () => {
      const result = await fetchEventsAndImages(options);

      if (!result.success) {
        logError(`Error fetching events: ${result.message}`);
        setState({ status: "error" });
        return;
      }

      setState({
        status: "success",
        organization: result.organization,
        events: result.events,
        nextCursor: result.nextCursor,
        imagesByEventId: result.imagesByEventId,
      });
    };

    initialize();
  }, [options]);

  const fetchMore = async () => {
    if (
      !options ||
      state.status !== "success" ||
      !state.nextCursor ||
      paginationState === "loading"
    ) {
      return;
    }

    setPaginationState("loading");

    const result = await fetchEventsAndImages(options, state.nextCursor);

    if (!result.success) {
      logError(`Error fetching more events: ${result.message}`);
      setPaginationState("error");
      return;
    }

    setState({
      status: "success",
      organization: state.organization,
      events: [...state.events, ...result.events],
      nextCursor: result.nextCursor,
      imagesByEventId: new Map([
        ...state.imagesByEventId,
        ...result.imagesByEventId,
      ]),
    });

    setPaginationState("idle");
  };

  const status = state.status;

  switch (status) {
    case "loading":
      return (
        <Empty>
          <Spinner className="size-7 text-secondary" />
        </Empty>
      );

    case "error":
      // Do not show anything on error
      return null;

    case "success": {
      if (state.events.length === 0) {
        return (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No customer proof found.</EmptyTitle>
              <EmptyDescription>
                There is no customer proof to display at this time.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        );
      }

      return (
        <div className="flex flex-col items-center gap-6">
          <SchemaMarkup
            organization={state.organization}
            events={state.events}
          />

          {!options?.hidePeerboundBadge && (
            <div
              part="peerbound-badge"
              className="flex items-center gap-2 text-sm"
            >
              <span>Verified by</span>
              <Logo aria-label="Peerbound" className="h-4.5 w-auto" />
            </div>
          )}

          <ProofGrid
            events={state.events}
            imagesByEventId={state.imagesByEventId}
          />

          {state.nextCursor && (
            <PaginationControls
              paginationState={paginationState}
              onLoadMore={fetchMore}
            />
          )}
        </div>
      );
    }

    default: {
      const unhandledStatus: never = status;
      logError(`Unhandled status: ${JSON.stringify(unhandledStatus)}`);
    }
  }
};
