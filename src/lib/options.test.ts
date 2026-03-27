import { describe, it, expect } from "vitest";
import { optionsSchema } from "@/lib/options";

const validUUID = crypto.randomUUID();

describe("optionsSchema", () => {
  describe("id validation", () => {
    it("should accept a valid UUID", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(validUUID);
    });

    it("should reject an invalid UUID", () => {
      const result = optionsSchema.safeParse({ id: "not-a-uuid" });
      expect(result.success).toBe(false);
    });

    it("should reject missing id", () => {
      const result = optionsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("token validation", () => {
    it("should accept a token string", () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        token: "abc123",
      });
      expect(result.success).toBe(true);
      expect(result.data?.token).toBe("abc123");
    });

    it("should allow missing token", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.token).toBeUndefined();
    });
  });

  describe("count validation", () => {
    it("should accept count of 1", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: 1 });
      expect(result.success).toBe(true);
      expect(result.data?.count).toBe(1);
    });

    it("should accept count of 50", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: 50 });
      expect(result.success).toBe(true);
      expect(result.data?.count).toBe(50);
    });

    it("should coerce string count to number", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: "25" });
      expect(result.success).toBe(true);
      expect(result.data?.count).toBe(25);
    });

    it("should reject count of 0", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: 0 });
      expect(result.success).toBe(false);
    });

    it("should reject count greater than 50", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: 51 });
      expect(result.success).toBe(false);
    });

    it("should reject negative count", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: -5 });
      expect(result.success).toBe(false);
    });

    it("should reject decimal count", () => {
      const result = optionsSchema.safeParse({ id: validUUID, count: 5.5 });
      expect(result.success).toBe(false);
    });

    it("should allow missing count", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.count).toBeUndefined();
    });
  });

  describe("hidePhotos validation", () => {
    it('should convert "true" string to true', () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        hidePhotos: "true",
      });

      expect(result.success).toBe(true);
      expect(result.data?.hidePhotos).toBe(true);
    });

    it('should convert "false" string to false', () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        hidePhotos: "false",
      });

      expect(result.success).toBe(true);
      expect(result.data?.hidePhotos).toBe(false);
    });

    it("should convert undefined to false", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.hidePhotos).toBe(false);
    });
  });

  describe("hidePeerboundBadge validation", () => {
    it('should convert "true" string to true', () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        hidePeerboundBadge: "true",
      });
      expect(result.success).toBe(true);
      expect(result.data?.hidePeerboundBadge).toBe(true);
    });

    it('should convert "false" string to false', () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        hidePeerboundBadge: "false",
      });
      expect(result.success).toBe(true);
      expect(result.data?.hidePeerboundBadge).toBe(false);
    });

    it("should convert undefined to false", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.hidePeerboundBadge).toBe(false);
    });
  });

  describe("filters validation", () => {
    it("should allow missing filters", () => {
      const result = optionsSchema.safeParse({ id: validUUID });
      expect(result.success).toBe(true);
      expect(result.data?.filters).toBeUndefined();
    });

    it("should reject invalid JSON", () => {
      const result = optionsSchema.safeParse({
        id: validUUID,
        filters: "not valid json",
      });
      expect(result.success).toBe(false);
    });

    it("should parse and transform single value filter", () => {
      const filters = JSON.stringify({ "account:name": "Acme" });
      const result = optionsSchema.safeParse({ id: validUUID, filters });

      expect(result.success).toBe(true);
      expect(result.data?.filters).toEqual([
        {
          object_name: "account",
          field_name: "name",
          values: ["Acme"],
        },
      ]);
    });

    it("should parse and transform array value filter", () => {
      const filters = JSON.stringify({
        "account:name": ["Acme", "Globex"],
      });
      const result = optionsSchema.safeParse({ id: validUUID, filters });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.filters).toEqual([
          {
            object_name: "account",
            field_name: "name",
            values: ["Acme", "Globex"],
          },
        ]);
      }
    });

    it("should handle multiple filters", () => {
      const filters = JSON.stringify({
        "account:name": "Acme",
        "contact:job_title": ["Engineer", "Manager"],
      });
      const result = optionsSchema.safeParse({ id: validUUID, filters });

      expect(result.success).toBe(true);
      expect(result.data?.filters).toEqual([
        {
          object_name: "account",
          field_name: "name",
          values: ["Acme"],
        },
        {
          object_name: "contact",
          field_name: "job_title",
          values: ["Engineer", "Manager"],
        },
      ]);
    });
  });
});
