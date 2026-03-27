import { describe, it, expect } from "vitest";
import { getLogoUrl, getContactForEvent, rewriteImageUrl } from "@/lib/images";
import {
  PublicAccount,
  PublicContact,
  PublicMoment,
  PublicReview,
  PublicStory,
} from "@/lib/schemas";
import { API_BASE_URL } from "./api";

const mockContact: PublicContact = {
  name: "John Doe",
  job_title: "Engineer",
  photo_url: null,
  linkedin_profile: null,
};

const mockAccount: PublicAccount = {
  id: "acc-123",
  name: "Acme Corp",
  domain_name: "acme.com",
  light_logo_url: null,
  dark_logo_url: null,
};

describe("rewriteImageUrl", () => {
  it("should rewrite app.peerbound.com to embed.peerbound.com", () => {
    const url = "https://app.peerbound.com/images/photo.jpg";
    expect(rewriteImageUrl(url)).toBe(
      "https://embed.peerbound.com/images/photo.jpg",
    );
  });

  it("should not modify URLs from other domains", () => {
    const url = "https://example.com/images/photo.jpg";
    expect(rewriteImageUrl(url)).toBe("https://example.com/images/photo.jpg");
  });

  it("should not modify embed.peerbound.com URLs", () => {
    const url = "https://embed.peerbound.com/images/photo.jpg";
    expect(rewriteImageUrl(url)).toBe(
      "https://embed.peerbound.com/images/photo.jpg",
    );
  });
});

describe("getLogoUrl", () => {
  it("should return light_logo_url when available", () => {
    const account: PublicAccount = {
      ...mockAccount,
      light_logo_url: "https://example.com/light-logo.png",
      dark_logo_url: "https://example.com/dark-logo.png",
    };

    expect(getLogoUrl(account, 64)).toBe("https://example.com/light-logo.png");
  });

  it("should return dark_logo_url when light_logo_url is null", () => {
    const account: PublicAccount = {
      ...mockAccount,
      light_logo_url: null,
      dark_logo_url: "https://example.com/dark-logo.png",
    };

    expect(getLogoUrl(account, 64)).toBe("https://example.com/dark-logo.png");
  });

  it("should return favicon URL when both logos are null", () => {
    const account: PublicAccount = {
      ...mockAccount,
      light_logo_url: null,
      dark_logo_url: null,
      domain_name: "acme.com",
    };

    const result = getLogoUrl(account, 64);
    expect(result).toBe(`${API_BASE_URL}/api/images/favicon/acme.com?size=64`);
  });

  it("should use the provided size in favicon URL", () => {
    const account: PublicAccount = {
      ...mockAccount,
      light_logo_url: null,
      dark_logo_url: null,
    };

    expect(getLogoUrl(account, 32)).toContain("size=32");
    expect(getLogoUrl(account, 64)).toContain("size=64");
  });
});

describe("getContactForEvent", () => {
  it("should return contact directly for moment events", () => {
    const moment: PublicMoment = {
      id: "moment-1",
      event_type: "moment",
      text: "Great product!",
      contact: mockContact,
      account: mockAccount,
      url: null,
      occurred_at: "2024-01-15T00:00:00",
    };

    expect(getContactForEvent(moment)).toBe(mockContact);
  });

  it("should return contact directly for review events", () => {
    const review: PublicReview = {
      id: "review-1",
      event_type: "review",
      star_rating: 5,
      title: "Excellent",
      answers: [{ question: "Q", answer: "A" }],
      contact: mockContact,
      account: mockAccount,
      product: { id: "prod-1", name: "Product" },
      url: "https://example.com/review",
      occurred_at: "2024-01-15T00:00:00",
    };

    expect(getContactForEvent(review)).toBe(mockContact);
  });

  it("should return quote.contact for story events", () => {
    const quoteContact = {
      name: "Jane Smith",
      job_title: "CEO",
      photo_url: null,
      linkedin_profile: null,
    };

    const story: PublicStory = {
      id: "story-1",
      event_type: "story",
      title: "Success Story",
      quote: {
        id: "quote-1",
        text: "This changed everything!",
        contact: quoteContact,
      },
      account: mockAccount,
      url: "https://example.com/story",
      occurred_at: "2024-01-15T00:00:00",
    };

    expect(getContactForEvent(story)).toBe(quoteContact);
  });
});
