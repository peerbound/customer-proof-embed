import { logError } from "@/utils/logger";
import {
  PublicAccount,
  PublicContact,
  PublicEvent,
  PublicMoment,
  PublicOrganization,
  PublicReview,
  PublicStory,
} from "@/lib/schemas";
import { Person, Organization, Review, Article } from "schema-dts";

export const getEventsMarkup = (
  organization: PublicOrganization,
  events: PublicEvent[],
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event) => {
      const eventType = event.event_type;

      switch (eventType) {
        case "moment":
          return getMomentMarkup(event, organization);
        case "review":
          return getReviewMarkup(event, organization);
        case "story":
          return getStoryMarkup(event, organization);
        default: {
          const unhandledEventType: never = eventType;
          logError(
            `Unhandled event type: ${JSON.stringify(unhandledEventType)}`,
          );
        }
      }
    }),
  };
};

const getMomentMarkup = (
  moment: PublicMoment,
  organization: PublicOrganization,
): Review => {
  return {
    "@type": "Review",
    author: getContactMarkup(moment.contact, moment.account),
    reviewBody: moment.text,
    itemReviewed: {
      "@type": "Organization",
      name: organization.name,
    },
    dateCreated: getDate(moment.occurred_at),
  };
};

const getReviewMarkup = (
  review: PublicReview,
  organization: PublicOrganization,
): Review => {
  return {
    "@type": "Review",
    author: getContactMarkup(review.contact, review.account),
    reviewBody: review.answers[0].answer,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.star_rating,
    },
    itemReviewed: {
      "@type": "Product",
      name: review.product.name,
      brand: {
        "@type": "Organization",
        name: organization.name,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "G2",
    },
    datePublished: getDate(review.occurred_at),
  };
};

const getContactMarkup = (
  contact: PublicContact,
  account: PublicAccount,
): Person => {
  return {
    "@type": "Person",
    name: contact.name,
    jobTitle: contact.job_title ?? undefined,
    worksFor: getAccountMarkup(account),
  };
};

const getAccountMarkup = (account: PublicAccount): Organization => {
  return {
    "@type": "Organization",
    name: account.name,
  };
};

const getStoryMarkup = (
  story: PublicStory,
  organization: PublicOrganization,
): Article => {
  return {
    "@type": "Article",
    headline: story.title,
    about: {
      "@type": "Organization",
      name: organization.name,
    },
    mainEntity: {
      "@type": "Review",
      author: getContactMarkup(story.quote.contact, story.account),
      reviewBody: story.quote.text,
      itemReviewed: {
        "@type": "Organization",
        name: organization.name,
      },
    },
    url: story.url,
    datePublished: getDate(story.occurred_at),
  };
};

const getDate = (date: string): string => {
  return date.split("T")[0];
};
