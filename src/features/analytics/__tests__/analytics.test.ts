import { describe, expect, it } from "bun:test";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import { computeAnalyticsSummary } from "../utils/analyticsMetrics";

const MOCK_APPS: ApplicationDto[] = [
  {
    id: "a1",
    userId: "u1",
    companyName: "Alpha",
    position: "Frontend",
    location: "Jakarta",
    employmentType: "Full-time",
    salaryRange: "Rp 20 jt",
    jobSource: "LinkedIn",
    jobUrl: null,
    keyRequirements: ["TypeScript", "Next.js"],
    jdSnapshot: null,
    status: "INTERVIEW_SCHEDULED",
    appliedAt: "2026-11-10T00:00:00Z",
    followUpAt: null,
    interviewAt: null,
    recruiterName: null,
    recruiterContact: null,
    createdAt: "2026-11-10T00:00:00Z",
    updatedAt: "2026-11-10T00:00:00Z",
    matchScore: 90,
  },
  {
    id: "a2",
    userId: "u1",
    companyName: "Beta",
    position: "Fullstack",
    location: "Remote",
    employmentType: "Full-time",
    salaryRange: null,
    jobSource: "LinkedIn",
    jobUrl: null,
    keyRequirements: ["TypeScript", "PostgreSQL"],
    jdSnapshot: null,
    status: "APPLIED",
    appliedAt: "2026-11-10T00:00:00Z",
    followUpAt: null,
    interviewAt: null,
    recruiterName: null,
    recruiterContact: null,
    createdAt: "2026-11-10T00:00:00Z",
    updatedAt: "2026-11-10T00:00:00Z",
    matchScore: 70,
  },
];

describe("computeAnalyticsSummary", () => {
  it("calculates deterministic metrics, H+7 count, average matchScore, and top skills", () => {
    const summary = computeAnalyticsSummary(MOCK_APPS, new Date("2026-11-20T00:00:00Z"));
    expect(summary.total).toBe(2);
    expect(summary.interviewRate).toBe(50);
    expect(summary.responseRate).toBe(50);
    expect(summary.followUpDueCount).toBe(1);
    expect(summary.avgMatchScore).toBe(80);
    expect(summary.sources[0]).toEqual({
      name: "LinkedIn",
      total: 2,
      responded: 1,
      responseRate: 50,
    });
    expect(summary.topRequirements[0]).toEqual({ skill: "TypeScript", count: 2, pct: 100 });
  });
});
