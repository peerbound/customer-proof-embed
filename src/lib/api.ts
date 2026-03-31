import axios, { AxiosError } from "axios";
import {
  PublicEvent,
  PublicEventSchema,
  PublicOrganizationSchema,
} from "@/lib/schemas";
import type { EmbedOptions } from "./options";
import { preloadEventImages, EventImages } from "@/lib/images";
import { logError } from "@/utils/logger";

export const API_BASE_URL =
  import.meta.env.PB_API_BASE_URL || "https://embed.peerbound.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

type FetchResult =
  | {
      success: true;
      events: PublicEvent[];
      organization: { id: string; name: string };
      nextCursor: string | null;
      imagesByEventId: Map<string, EventImages>;
    }
  | {
      success: false;
      message: string;
    };

export const fetchEvents = async (options: EmbedOptions, cursor?: string) => {
  const { id, token, count, filters } = options;

  // Use preview endpoint if token is provided, otherwise use regular endpoint
  const url = token ? `/api/embed/v1/preview/${id}` : `/api/embed/v1/${id}`;

  const { data } = await api.get(url, {
    params: {
      crm_filters: filters ? JSON.stringify({ filters }) : undefined,
      page_size: count,
      token,
      cursor,
    },
  });

  const organization = PublicOrganizationSchema.parse(data.organization);

  const events: PublicEvent[] = [];

  for (const event of data.events) {
    try {
      const validatedEvent = PublicEventSchema.parse(event);
      events.push(validatedEvent);
    } catch (error) {
      logError(`Error parsing event`, error);
    }
  }

  return {
    organization,
    events,
    nextCursor: data.pagination?.next_cursor ?? null,
  };
};

export const fetchEventsAndImages = async (
  options: EmbedOptions,
  cursor?: string,
): Promise<FetchResult> => {
  try {
    const { organization, events, nextCursor } = await fetchEvents(
      options,
      cursor,
    );

    const imagesByEventId = await preloadEventImages(
      events,
      options.hidePhotos,
    );

    return {
      success: true,
      events,
      organization,
      nextCursor,
      imagesByEventId,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        return {
          success: false,
          message: "Embed not found. Check your `embed-id` attribute.",
        };
      }

      if (status && status >= 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
        };
      }
    }

    return {
      success: false,
      message: "Unable to load. Please try again later.",
    };
  }
};
