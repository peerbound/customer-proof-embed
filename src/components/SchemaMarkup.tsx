import { PublicEvent, PublicOrganization } from "@/lib/schemas";
import { getEventsMarkup } from "../lib/markup";

/**
 * Renders JSON-LD structured data for events using Schema.org vocabulary.
 * This markup helps search and AI engines understand the data on the page.
 *
 * @see https://schema.org
 */
interface SchemaMarkupProps {
  organization: PublicOrganization;
  events: PublicEvent[];
}

export const SchemaMarkup = ({ organization, events }: SchemaMarkupProps) => {
  return (
    <script type="application/ld+json">
      {JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: getEventsMarkup(organization, events),
        },
        null,
        2,
      )}
    </script>
  );
};
