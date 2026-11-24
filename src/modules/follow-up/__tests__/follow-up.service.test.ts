import { describe, expect, it } from "bun:test";
import { createFollowUpService, evaluateFollowUpStatus } from "../follow-up.service";
import type { ApplicationRecord } from "@/modules/applications/applications.repository";

describe("followUpService", () => {
  it("evaluates H+7 follow-up threshold accurately", () => {
    const appliedAt = new Date("2026-11-10T00:00:00Z");
    const day5 = evaluateFollowUpStatus(appliedAt, new Date("2026-11-15T00:00:00Z"));
    expect(day5.isDue).toBe(false);
    expect(day5.daysSinceApplied).toBe(5);

    const day8 = evaluateFollowUpStatus(appliedAt, new Date("2026-11-18T00:00:00Z"));
    expect(day8.isDue).toBe(true);
    expect(day8.daysSinceApplied).toBe(8);
  });

  it("generates polite draft and logs activity via applicationsService", async () => {
    const loggedLanguages: string[] = [];
    const mockApp: ApplicationRecord = {
      id: "11111111-1111-4111-8111-111111111111",
      userId: "u1",
      companyName: "PT Inovasi Digital",
      position: "Backend Engineer",
      location: "Jakarta",
      employmentType: "Full-time",
      salaryRange: null,
      jobSource: "LinkedIn",
      jobUrl: null,
      keyRequirements: ["TypeScript"],
      jdSnapshot: null,
      status: "APPLIED",
      appliedAt: new Date("2026-11-10T00:00:00Z"),
      followUpAt: new Date("2026-11-17T00:00:00Z"),
      interviewAt: null,
      recruiterName: "Ibu Rina",
      recruiterContact: "rina@inovasi.id",
      createdAt: new Date("2026-11-10T00:00:00Z"),
      updatedAt: new Date("2026-11-10T00:00:00Z"),
      matchScore: 88,
    };

    const service = createFollowUpService({
      applications: {
        async getApplicationById() {
          return mockApp;
        },
        async recordFollowUpDraft(_u, _id, lang) {
          loggedLanguages.push(lang);
        },
      },
      generateDraft: async ({ language }) => ({
        subject: language === "id" ? "Follow-up Lamaran Backend Engineer" : "Follow-up on Backend Engineer Application",
        body: "Halo Ibu Rina, saya ingin menanyakan perkembangan lamaran saya.",
      }),
      now: () => new Date("2026-11-18T00:00:00Z"),
    });

    const result = await service.generate("u1", {
      applicationId: mockApp.id,
      language: "id",
      tone: "formal",
    });

    expect(result.timing.isDue).toBe(true);
    expect(result.draft.subject).toContain("Backend Engineer");
    expect(loggedLanguages).toEqual(["id"]);
  });
});
