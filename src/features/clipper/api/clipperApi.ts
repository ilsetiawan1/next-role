import type { ApplicationDto } from "@/features/shared/workspace-types";

export interface ExtractedJobDto {
  companyName: string;
  position: string;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  jobSource: string | null;
  keyRequirements: string[];
  jdSnapshot: string;
}

export interface ExtractJobResponse {
  data: ExtractedJobDto;
  meta: {
    cached: boolean;
    quotaUsed: number;
    quotaLimit: number;
  };
}

export async function extractJobWithAi(payload: {
  inputType: "RAW_TEXT" | "JOB_URL" | "POSTER_IMAGE";
  content?: string;
  imageBase64?: string;
  mimeType?: "image/png" | "image/jpeg" | "image/webp";
}): Promise<ExtractJobResponse> {
  const res = await fetch("/api/v1/parser/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal mengekstrak lowongan dengan AI.");
  }
  return json as ExtractJobResponse;
}

export async function createApplicationApi(payload: {
  companyName: string;
  position: string;
  location?: string | null;
  employmentType?: string | null;
  salaryRange?: string | null;
  jobSource?: string | null;
  jobUrl?: string | null;
  keyRequirements: string[];
  jdSnapshot?: string | null;
  recruiterName?: string | null;
  recruiterContact?: string | null;
}): Promise<ApplicationDto> {
  const res = await fetch("/api/v1/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal menyimpan lamaran.");
  }
  return json.data as ApplicationDto;
}
