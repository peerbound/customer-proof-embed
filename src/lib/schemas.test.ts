import { describe, it, expect } from "vitest";
import {
  PublicOrganizationSchema,
  PublicContactSchema,
  PublicAccountSchema,
  PublicMomentSchema,
  QuestionAnswerSchema,
  PublicProductSchema,
  PublicReviewSchema,
  PublicStoryQuoteSchema,
  PublicStorySchema,
  PublicEventSchema,
} from "@/lib/schemas";

const validContact = {
  name: "John Doe",
  job_title: "Engineer",
  photo_url: "https://example.com/photo.jpg",
  linkedin_profile: "https://linkedin.com/in/johndoe",
};

const validAccount = {
  id: "acc-123",
  name: "Acme Corp",
  domain_name: "acme.com",
  light_logo_url: "https://example.com/light.png",
  dark_logo_url: "https://example.com/dark.png",
};

const validMoment = {
  id: "moment-123",
  event_type: "moment",
  text: "This is a great product!",
  contact: validContact,
  account: validAccount,
  url: null,
  occurred_at: "2024-01-15T10:00:00Z",
};

const validReview = {
  id: "review-123",
  event_type: "review",
  star_rating: 4,
  title: "Great Product",
  answers: [{ question: "What did you think?", answer: "Loved it!" }],
  product: { id: "prod-123", name: "Test Product" },
  contact: validContact,
  account: validAccount,
  url: "https://example.com/review",
  occurred_at: "2024-01-15T10:00:00Z",
};

const validStory = {
  id: "story-123",
  event_type: "story",
  title: "Customer Success Story",
  quote: {
    id: "quote-123",
    text: "This changed everything!",
    contact: validContact,
  },
  account: validAccount,
  url: "https://example.com/story",
  occurred_at: "2024-01-15T10:00:00Z",
};

describe("PublicOrganizationSchema", () => {
  it("should accept valid organization", () => {
    const result = PublicOrganizationSchema.safeParse({
      id: "org-123",
      name: "Test Org",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing id", () => {
    const result = PublicOrganizationSchema.safeParse({ name: "Test Org" });
    expect(result.success).toBe(false);
  });

  it("should reject missing name", () => {
    const result = PublicOrganizationSchema.safeParse({ id: "org-123" });
    expect(result.success).toBe(false);
  });
});

describe("PublicContactSchema", () => {
  it("should accept valid contact with all fields", () => {
    const result = PublicContactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("should accept contact with nullable fields as null", () => {
    const result = PublicContactSchema.safeParse({
      name: "John Doe",
      job_title: null,
      photo_url: null,
      linkedin_profile: null,
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing name", () => {
    const result = PublicContactSchema.safeParse({
      job_title: "Engineer",
      photo_url: null,
      linkedin_profile: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("PublicAccountSchema", () => {
  it("should accept valid account", () => {
    const result = PublicAccountSchema.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  it("should accept account with null logo URLs", () => {
    const result = PublicAccountSchema.safeParse({
      ...validAccount,
      light_logo_url: null,
      dark_logo_url: null,
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid logo URL", () => {
    const result = PublicAccountSchema.safeParse({
      ...validAccount,
      light_logo_url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should accept null domain_name", () => {
    const result = PublicAccountSchema.safeParse({
      ...validAccount,
      domain_name: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("QuestionAnswerSchema", () => {
  it("should accept valid question and answer", () => {
    const result = QuestionAnswerSchema.safeParse({
      question: "How was your experience?",
      answer: "It was great!",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing question", () => {
    const result = QuestionAnswerSchema.safeParse({
      answer: "It was great!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing answer", () => {
    const result = QuestionAnswerSchema.safeParse({
      question: "How was your experience?",
    });
    expect(result.success).toBe(false);
  });
});

describe("PublicProductSchema", () => {
  it("should accept valid product", () => {
    const result = PublicProductSchema.safeParse({
      id: "prod-123",
      name: "Test Product",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing name", () => {
    const result = PublicProductSchema.safeParse({
      id: "prod-123",
    });
    expect(result.success).toBe(false);
  });
});

describe("PublicMomentSchema", () => {
  it("should accept valid moment", () => {
    const result = PublicMomentSchema.safeParse(validMoment);
    expect(result.success).toBe(true);
  });

  it("should reject invalid event_type", () => {
    const result = PublicMomentSchema.safeParse({
      ...validMoment,
      event_type: "review",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid URL", () => {
    const result = PublicMomentSchema.safeParse({
      ...validMoment,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("PublicReviewSchema", () => {
  it("should accept valid review", () => {
    const result = PublicReviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("should accept star_rating of 0", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      star_rating: 0,
    });
    expect(result.success).toBe(true);
  });

  it("should accept star_rating of 5", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      star_rating: 5,
    });
    expect(result.success).toBe(true);
  });

  it("should reject star_rating below 0", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      star_rating: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject star_rating above 5", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      star_rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it("should accept decimal star_rating within range", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      star_rating: 4.5,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty answers array", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      answers: [],
    });
    expect(result.success).toBe(false);
  });

  it("should accept multiple answers", () => {
    const result = PublicReviewSchema.safeParse({
      ...validReview,
      answers: [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing URL", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url, ...reviewWithoutUrl } = validReview;
    const result = PublicReviewSchema.safeParse(reviewWithoutUrl);
    expect(result.success).toBe(false);
  });
});

describe("PublicStoryQuoteSchema", () => {
  it("should accept valid quote", () => {
    const result = PublicStoryQuoteSchema.safeParse({
      id: "quote-123",
      text: "This changed everything!",
      contact: validContact,
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing text", () => {
    const result = PublicStoryQuoteSchema.safeParse({
      id: "quote-123",
      contact: validContact,
    });
    expect(result.success).toBe(false);
  });
});

describe("PublicStorySchema", () => {
  it("should accept valid story", () => {
    const result = PublicStorySchema.safeParse(validStory);
    expect(result.success).toBe(true);
  });

  it("should reject missing URL", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url, ...storyWithoutUrl } = validStory;
    const result = PublicStorySchema.safeParse(storyWithoutUrl);
    expect(result.success).toBe(false);
  });
});

describe("PublicEventSchema (discriminated union)", () => {
  it("should parse moment event correctly", () => {
    const result = PublicEventSchema.safeParse(validMoment);
    expect(result.success).toBe(true);
  });

  it("should parse review event correctly", () => {
    const result = PublicEventSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("should parse story event correctly", () => {
    const result = PublicEventSchema.safeParse(validStory);
    expect(result.success).toBe(true);
  });

  it("should reject unknown event_type", () => {
    const unknown = {
      id: "unknown-123",
      event_type: "unknown",
      account: validAccount,
    };

    const result = PublicEventSchema.safeParse(unknown);
    expect(result.success).toBe(false);
  });

  it("should reject event with missing discriminator", () => {
    const noType = {
      id: "no-type-123",
      text: "Some text",
      contact: validContact,
      account: validAccount,
    };

    const result = PublicEventSchema.safeParse(noType);
    expect(result.success).toBe(false);
  });
});
