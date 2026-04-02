import { PublicAccount, PublicEvent } from "@/lib/schemas";
import { API_BASE_URL } from "@/lib/api";

export interface EventImages {
  logoUrl?: string;
  photoUrl?: string;
}

export const getLogoUrl = (account: PublicAccount, sizeToRequest: number) => {
  const brandLogoUrl = account.light_logo_url ?? account.dark_logo_url;

  if (brandLogoUrl) {
    return brandLogoUrl;
  }

  if (account.domain_name) {
    return `${API_BASE_URL}/api/images/favicon/${account.domain_name}?size=${sizeToRequest}`;
  }
};

const loadImage = (url: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    // Enforce half second timeout
    const timer = setTimeout(() => resolve(null), 500);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = url;
  });

export const getContactForEvent = (event: PublicEvent) => {
  if (event.event_type === "story") {
    return event.quote.contact;
  }

  return event.contact;
};

const loadLogos = async (
  events: PublicEvent[],
  hidePhotos: boolean,
): Promise<Map<string, string>> => {
  const eventLogoUrls = events.flatMap((event) => {
    const contact = getContactForEvent(event);
    const hasPhoto = !hidePhotos && Boolean(contact.photo_url);
    const sizeToRequest = hasPhoto ? 32 : 64;
    const url = getLogoUrl(event.account, sizeToRequest);

    return url ? [{ eventId: event.id, url, sizeToRequest }] : [];
  });

  const uniqueUrls = [...new Set(eventLogoUrls.map(({ url }) => url))];

  const urlToImg = new Map(
    await Promise.all(
      uniqueUrls.map(async (url) => [url, await loadImage(url)] as const),
    ),
  );

  const result = new Map<string, string>();

  for (const { eventId, url, sizeToRequest } of eventLogoUrls) {
    const img = urlToImg.get(url);

    if (img) {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const isSquare = width === height;
      const isLargeEnough = Math.min(width, height) >= sizeToRequest;

      if (isSquare && isLargeEnough) {
        result.set(eventId, url);
      }
    }
  }

  return result;
};

const loadPhotos = async (
  events: PublicEvent[],
  hidePhotos: boolean,
): Promise<Map<string, string>> => {
  const result = new Map<string, string>();
  if (hidePhotos) return result;

  const eventPhotoUrls = events
    .map((event) => {
      const photoUrl = getContactForEvent(event).photo_url;
      return {
        eventId: event.id,
        url: photoUrl ? rewriteImageUrl(photoUrl) : null,
      };
    })
    .filter((item): item is { eventId: string; url: string } =>
      Boolean(item.url),
    );

  const uniqueUrls = [...new Set(eventPhotoUrls.map(({ url }) => url))];

  const loadedUrls = new Set(
    (await Promise.all(uniqueUrls.map((url) => loadImage(url))))
      .map((img, i) => (img ? uniqueUrls[i] : null))
      .filter((url): url is string => url !== null),
  );

  for (const { eventId, url } of eventPhotoUrls) {
    if (loadedUrls.has(url)) {
      result.set(eventId, url);
    }
  }

  return result;
};

export const preloadEventImages = async (
  events: PublicEvent[],
  hidePhotos: boolean,
): Promise<Map<string, EventImages>> => {
  const [logoUrlByEventId, photoUrlByEventId] = await Promise.all([
    loadLogos(events, hidePhotos),
    loadPhotos(events, hidePhotos),
  ]);

  const result = new Map<string, EventImages>();

  for (const event of events) {
    result.set(event.id, {
      logoUrl: logoUrlByEventId.get(event.id),
      photoUrl: photoUrlByEventId.get(event.id),
    });
  }

  return result;
};

/**
 * Rewrites image URLs to use the embed subdomain instead of app.
 * This simplifies the customer's CSP configuration for the widget.
 * e.g., https://app.peerbound.com/... -> https://embed.peerbound.com/...
 */
export const rewriteImageUrl = (url: string): string => {
  return url.replace(
    /^https:\/\/app\.(stage\.)?peerbound\.com/,
    `https://embed.$1peerbound.com`,
  );
};
