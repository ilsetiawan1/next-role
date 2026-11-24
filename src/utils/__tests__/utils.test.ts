import { describe, expect, it } from "bun:test";
import { calculateFollowUpDate, isSameUtcDay } from "../date";
import { normalizeWhitespace, sanitizeFileName } from "../format";
import { sha256Hex } from "../hash";

describe("NextRole core utils", () => {
  it("computes deterministic SHA-256 hex digest", () => {
    const hash = sha256Hex("next-role");
    expect(hash.length).toBe(64);
    expect(hash).toBe(sha256Hex("next-role"));
  });

  it("calculates H+7 follow-up date", () => {
    const applied = new Date("2026-11-24T00:00:00.000Z");
    const followUp = calculateFollowUpDate(applied);
    expect(followUp.toISOString().startsWith("2026-12-01")).toBe(true);
    expect(isSameUtcDay(applied, new Date("2026-11-24T23:59:59.000Z"))).toBe(true);
  });

  it("normalizes whitespace and sanitizes file names without RegEx", () => {
    expect(normalizeWhitespace("  Senior   Frontend   Engineer  ")).toBe(
      "Senior Frontend Engineer"
    );
    expect(sanitizeFileName("CV Ilham (2026).pdf")).toBe("CV-Ilham--2026-.pdf");
  });
});
