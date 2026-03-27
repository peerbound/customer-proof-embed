import { describe, it, expect } from "vitest";
import { getEventsMarkup } from "@/lib/markup";
import { PublicMoment, PublicReview, PublicStory } from "@/lib/schemas";

const mockOrganization = {
  id: "org-123",
  name: "Test Organization",
};

const mockAccount = {
  id: "acc-123",
  name: "Acme Corp",
  domain_name: "acme.com",
  light_logo_url: null,
  dark_logo_url: null,
};

const mockContact = {
  name: "John Doe",
  job_title: "Software Engineer",
  photo_url: null,
  linkedin_profile: null,
};

const mockProduct = {
  id: "prod-123",
  name: "Test Product",
};

describe("getEventsMarkup", () => {
  it("should return schema.org ItemList structure", () => {
    const result = getEventsMarkup(mockOrganization, []);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("ItemList");
    expect(result.itemListElement).toEqual([]);
  });

  it("should transform a moment event to Review schema", () => {
    const moment: PublicMoment = {
      id: "moment-1",
      event_type: "moment",
      text: "This product is amazing!",
      contact: mockContact,
      account: mockAccount,
      url: null,
      occurred_at: "2024-01-15T00:00:00",
    };

    const result = getEventsMarkup(mockOrganization, [moment]);

    expect(result.itemListElement).toHaveLength(1);
    expect(result.itemListElement[0]).toEqual({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "John Doe",
        jobTitle: "Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Acme Corp",
        },
      },
      reviewBody: "This product is amazing!",
      itemReviewed: {
        "@type": "Organization",
        name: "Test Organization",
      },
      dateCreated: "2024-01-15",
    });
  });

  it("should transform a review event to Review schema with rating", () => {
    const review: PublicReview = {
      id: "review-1",
      event_type: "review",
      star_rating: 5,
      title: "Great Product",
      answers: [{ question: "What did you think?", answer: "Loved it!" }],
      contact: mockContact,
      account: mockAccount,
      product: mockProduct,
      url: "https://example.com/review",
      occurred_at: "2024-02-20T14:00:00",
    };

    const result = getEventsMarkup(mockOrganization, [review]);

    expect(result.itemListElement).toHaveLength(1);
    expect(result.itemListElement[0]).toEqual({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "John Doe",
        jobTitle: "Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Acme Corp",
        },
      },
      reviewBody: "Loved it!",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
      },
      itemReviewed: {
        "@type": "Product",
        name: "Test Product",
        brand: {
          "@type": "Organization",
          name: "Test Organization",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "G2",
      },
      datePublished: "2024-02-20",
    });
  });

  it("should transform a story event to Article schema", () => {
    const story: PublicStory = {
      id: "story-1",
      event_type: "story",
      title: "Customer Success Story",
      quote: {
        id: "quote-1",
        text: "This changed our business!",
        contact: mockContact,
      },
      account: mockAccount,
      url: "https://example.com/story",
      occurred_at: "2024-03-10T09:00:00",
    };

    const result = getEventsMarkup(mockOrganization, [story]);

    expect(result.itemListElement).toHaveLength(1);
    expect(result.itemListElement[0]).toEqual({
      "@type": "Article",
      headline: "Customer Success Story",
      about: {
        "@type": "Organization",
        name: "Test Organization",
      },
      mainEntity: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "John Doe",
          jobTitle: "Software Engineer",
          worksFor: {
            "@type": "Organization",
            name: "Acme Corp",
          },
        },
        reviewBody: "This changed our business!",
        itemReviewed: {
          "@type": "Organization",
          name: "Test Organization",
        },
      },
      url: "https://example.com/story",
      datePublished: "2024-03-10",
    });
  });

  it("should handle multiple events of different types", () => {
    const moment: PublicMoment = {
      id: "moment-1",
      event_type: "moment",
      text: "Quick feedback",
      contact: mockContact,
      account: mockAccount,
      url: null,
      occurred_at: "2024-01-01T00:00:00Z",
    };

    const review: PublicReview = {
      id: "review-1",
      event_type: "review",
      star_rating: 4,
      title: "Good",
      answers: [{ question: "Q", answer: "A" }],
      contact: mockContact,
      account: mockAccount,
      product: mockProduct,
      url: "https://example.com",
      occurred_at: "2024-01-02T00:00:00",
    };

    const result = getEventsMarkup(mockOrganization, [moment, review]);

    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0]?.["@type"]).toBe("Review");
    expect(result.itemListElement[1]?.["@type"]).toBe("Review");
  });
});
