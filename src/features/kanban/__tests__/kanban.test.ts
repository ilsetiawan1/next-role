import { describe, expect, it } from "bun:test";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import {
  filterApplicationsForFolder,
  KANBAN_FOLDERS,
  mapStatusToKanbanFolder,
} from "../types/kanban.types";

const SAMPLE_APPS: ApplicationDto[] = [
  {
    id: "1",
    userId: "u1",
    companyName: "PT Nusantara Digital",
    position: "Frontend Engineer",
    location: "Jakarta Hybrid",
    employmentType: "Full-time",
    salaryRange: "Rp 18 jt",
    jobSource: "LinkedIn",
    jobUrl: null,
    keyRequirements: ["React", "TypeScript"],
    jdSnapshot: "Membangun UI web modern.",
    status: "APPLIED",
    appliedAt: "2026-11-20T00:00:00Z",
    followUpAt: null,
    interviewAt: null,
    recruiterName: null,
    recruiterContact: null,
    createdAt: "2026-11-20T00:00:00Z",
    updatedAt: "2026-11-20T00:00:00Z",
    matchScore: 86,
  },
  {
    id: "2",
    userId: "u1",
    companyName: "CV Karya Mandiri",
    position: "Backend Engineer",
    location: "Bandung Remote",
    employmentType: "Contract",
    salaryRange: null,
    jobSource: "Glints",
    jobUrl: null,
    keyRequirements: ["PostgreSQL"],
    jdSnapshot: null,
    status: "GHOSTED",
    appliedAt: "2026-11-01T00:00:00Z",
    followUpAt: null,
    interviewAt: null,
    recruiterName: null,
    recruiterContact: null,
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    matchScore: 72,
  },
];

describe("Kanban 5-folder mapping & search", () => {
  it("defines exactly 5 pipeline folders without Wishlist", () => {
    expect(KANBAN_FOLDERS.length).toBe(5);
    expect(KANBAN_FOLDERS.some((f) => f.title.toLowerCase().includes("wishlist"))).toBe(false);
  });

  it("maps REJECTED and GHOSTED into REJECTED_OR_GHOSTED folder", () => {
    expect(mapStatusToKanbanFolder("REJECTED")).toBe("REJECTED_OR_GHOSTED");
    expect(mapStatusToKanbanFolder("GHOSTED")).toBe("REJECTED_OR_GHOSTED");
    expect(mapStatusToKanbanFolder("INTERVIEW_SCHEDULED")).toBe("INTERVIEW_SCHEDULED");
  });

  it("filters applications by folder and case-insensitive query without RegEx", () => {
    const applied = filterApplicationsForFolder(SAMPLE_APPS, "APPLIED", "frontend");
    expect(applied.length).toBe(1);
    expect(applied[0].companyName).toBe("PT Nusantara Digital");

    const archived = filterApplicationsForFolder(SAMPLE_APPS, "REJECTED_OR_GHOSTED", "bandung");
    expect(archived.length).toBe(1);
    expect(archived[0].id).toBe("2");
  });
});
