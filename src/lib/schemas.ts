import { z } from "zod";

export const PublicOrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const PublicContactSchema = z.object({
  name: z.string(),
  job_title: z.string().nullable(),
  photo_url: z.string().nullable(),
  linkedin_profile: z.string().nullable(),
});

export const PublicAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain_name: z.string().nullable(),
  light_logo_url: z.url().nullable(),
  dark_logo_url: z.url().nullable(),
});

export const PublicMomentSchema = z.object({
  id: z.string(),
  event_type: z.literal("moment"),
  text: z.string(),
  contact: PublicContactSchema,
  account: PublicAccountSchema,
  url: z.url().nullable(),
  occurred_at: z.string(), // ISO datetime string
});

export const QuestionAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const PublicProductSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const PublicReviewSchema = z.object({
  id: z.string(),
  event_type: z.literal("review"),
  star_rating: z.number().min(0).max(5),
  title: z.string(),
  answers: z.array(QuestionAnswerSchema).min(1),
  product: PublicProductSchema,
  contact: PublicContactSchema,
  account: PublicAccountSchema,
  url: z.url(),
  occurred_at: z.string(), // ISO datetime string
});

export const PublicStoryQuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  contact: PublicContactSchema,
});

export const PublicStorySchema = z.object({
  id: z.string(),
  event_type: z.literal("story"),
  title: z.string(),
  quote: PublicStoryQuoteSchema,
  account: PublicAccountSchema,
  url: z.url(),
  occurred_at: z.string(), // ISO date string
});

export const PublicEventSchema = z.discriminatedUnion("event_type", [
  PublicMomentSchema,
  PublicReviewSchema,
  PublicStorySchema,
]);

export type PublicOrganization = z.infer<typeof PublicOrganizationSchema>;
export type PublicContact = z.infer<typeof PublicContactSchema>;
export type PublicAccount = z.infer<typeof PublicAccountSchema>;
export type PublicMoment = z.infer<typeof PublicMomentSchema>;
export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>;
export type PublicReview = z.infer<typeof PublicReviewSchema>;
export type PublicStoryQuote = z.infer<typeof PublicStoryQuoteSchema>;
export type PublicStory = z.infer<typeof PublicStorySchema>;
export type PublicEvent = z.infer<typeof PublicEventSchema>;
