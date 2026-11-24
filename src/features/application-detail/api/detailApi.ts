import type { ApplicationStatusType } from "@/constants/application";
import type { ApplicationDto } from "@/features/shared/workspace-types";

export async function fetchApplicationDetail(id: string): Promise<ApplicationDto> {
  const res = await fetch(`/api/v1/applications/${id}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal memuat detail lamaran.");
  }
  return json.data as ApplicationDto;
}

export async function updateApplicationApi(
  id: string,
  payload: {
    location?: string | null;
    employmentType?: string | null;
    salaryRange?: string | null;
    jobSource?: string | null;
    jobUrl?: string | null;
    recruiterName?: string | null;
    recruiterContact?: string | null;
  }
): Promise<ApplicationDto> {
  const res = await fetch(`/api/v1/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal menyimpan perubahan lamaran.");
  }
  return json.data as ApplicationDto;
}

export async function updateApplicationStatusApi(
  id: string,
  status: ApplicationStatusType,
  notes?: string
): Promise<ApplicationDto> {
  const res = await fetch(`/api/v1/applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal memperbarui status lamaran.");
  }
  return json.data as ApplicationDto;
}

export async function deleteApplicationApi(id: string): Promise<void> {
  const res = await fetch(`/api/v1/applications/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal menghapus lamaran.");
  }
}

export interface FollowUpResultDto {
  applicationId: string;
  language: "id" | "en";
  tone: "formal" | "casual";
  timing: {
    daysSinceApplied: number;
    recommendedFollowUpAt: string;
    isDue: boolean;
  };
  draft: {
    subject: string;
    body: string;
  };
}

export async function generateFollowUpApi(payload: {
  applicationId: string;
  language: "id" | "en";
  tone: "formal" | "casual";
}): Promise<FollowUpResultDto> {
  const res = await fetch("/api/v1/follow-up/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal membuat draf follow-up.");
  }
  return json.data as FollowUpResultDto;
}
