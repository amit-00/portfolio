import { describe, test, expect } from "bun:test";
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  test("formats an ISO date as 'Mon D, YYYY' without timezone drift", () => {
    expect(formatDate("2026-03-05")).toBe("Mar 5, 2026");
    expect(formatDate("2026-01-10")).toBe("Jan 10, 2026");
  });
});
