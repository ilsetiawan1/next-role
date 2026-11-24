import type { ApplicationStatusType } from "@/constants/application";

export interface ActivityLogDto {
  id: string;
  actionType: string;
  notes: string | null;
  createdAt: string;
}

export interface ApplicationDto {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  jobSource: string | null;
  jobUrl: string | null;
  keyRequirements: string[];
  jdSnapshot: string | null;
  status: ApplicationStatusType;
  appliedAt: string;
  followUpAt: string | null;
  interviewAt: string | null;
  recruiterName: string | null;
  recruiterContact: string | null;
  createdAt: string;
  updatedAt: string;
  matchScore: number | null;
  activities?: ActivityLogDto[];
}

export interface ProfileDto {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  quota: {
    used: number;
    limit: number;
  };
  cv: {
    fileName: string | null;
    updatedAt: string | null;
    hasCv: boolean;
  };
}

export function getCompanyInitial(companyName: string): string {
  const clean = companyName.trim();
  return clean.length > 0 ? clean[0].toUpperCase() : "N";
}

export function getUserInitials(name: string | null | undefined, email: string): string {
  const source = (name ?? "").trim();
  if (source.length > 0) {
    const parts = source.split(" ").filter((p) => p.length > 0);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function formatShortDateId(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getDaysSince(isoDate: string, now: Date = new Date()): number {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 0;
  const diffMs = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
}
