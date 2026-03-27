import { describe, it, expect } from "vitest";
import { getColumnCount, buildColumns } from "@/hooks/useMasonryLayout";
import { PublicEvent } from "@/lib/schemas";

const createMockEvent = (id: string): PublicEvent => ({
  id,
  event_type: "moment",
  text: `Event ${id}`,
  contact: {
    name: "John Doe",
    job_title: null,
    photo_url: null,
    linkedin_profile: null,
  },
  account: {
    id: "acc-1",
    name: "Acme",
    domain_name: "acme.com",
    light_logo_url: null,
    dark_logo_url: null,
  },
  url: null,
  occurred_at: "2024-01-01T00:00:00Z",
});

describe("getColumnCount", () => {
  it("should return 1 column for width < 640", () => {
    expect(getColumnCount(0)).toBe(1);
    expect(getColumnCount(320)).toBe(1);
    expect(getColumnCount(639)).toBe(1);
  });

  it("should return 2 columns for width >= 640 and < 1024", () => {
    expect(getColumnCount(640)).toBe(2);
    expect(getColumnCount(800)).toBe(2);
    expect(getColumnCount(1023)).toBe(2);
  });

  it("should return 3 columns for width >= 1024 and < 1280", () => {
    expect(getColumnCount(1024)).toBe(3);
    expect(getColumnCount(1100)).toBe(3);
    expect(getColumnCount(1279)).toBe(3);
  });

  it("should return 4 columns for width >= 1280", () => {
    expect(getColumnCount(1280)).toBe(4);
    expect(getColumnCount(1920)).toBe(4);
    expect(getColumnCount(2560)).toBe(4);
  });
});

describe("buildColumns", () => {
  it("should distribute events into single column", () => {
    const events = [createMockEvent("1"), createMockEvent("2")];
    const assignments = [0, 0];

    const result = buildColumns(events, assignments);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0].id).toBe("1");
    expect(result[0][1].id).toBe("2");
  });

  it("should distribute events across two columns", () => {
    const events = [
      createMockEvent("1"),
      createMockEvent("2"),
      createMockEvent("3"),
      createMockEvent("4"),
    ];
    const assignments = [0, 1, 1, 1];

    const result = buildColumns(events, assignments);

    expect(result).toHaveLength(2);
    expect(result[0].map((e) => e.id)).toEqual(["1"]);
    expect(result[1].map((e) => e.id)).toEqual(["2", "3", "4"]);
  });

  it("should distribute events across three columns", () => {
    const events = [
      createMockEvent("1"),
      createMockEvent("2"),
      createMockEvent("3"),
      createMockEvent("4"),
      createMockEvent("5"),
      createMockEvent("6"),
    ];
    const assignments = [0, 1, 2, 2, 0, 2];

    const result = buildColumns(events, assignments);

    expect(result).toHaveLength(3);
    expect(result[0].map((e) => e.id)).toEqual(["1", "5"]);
    expect(result[1].map((e) => e.id)).toEqual(["2"]);
    expect(result[2].map((e) => e.id)).toEqual(["3", "4", "6"]);
  });

  it("should handle four columns", () => {
    const events = [
      createMockEvent("1"),
      createMockEvent("2"),
      createMockEvent("3"),
      createMockEvent("4"),
    ];
    const assignments = [0, 1, 2, 3];

    const result = buildColumns(events, assignments);

    expect(result).toHaveLength(4);
    expect(result[0][0].id).toBe("1");
    expect(result[1][0].id).toBe("2");
    expect(result[2][0].id).toBe("3");
    expect(result[3][0].id).toBe("4");
  });

  it("should handle empty events array", () => {
    const events: PublicEvent[] = [];
    const assignments: number[] = [];

    const result = buildColumns(events, assignments);
    expect(result).toEqual([]);
  });
});
