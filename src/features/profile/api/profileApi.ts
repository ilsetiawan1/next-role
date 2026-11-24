import type { ProfileDto } from "@/features/shared/workspace-types";

export async function uploadCvApi(file: File): Promise<ProfileDto & { reembedded: boolean }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/v1/profile/cv", {
    method: "PUT",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal mengunggah CV PDF.");
  }
  return json.data as ProfileDto & { reembedded: boolean };
}

export async function getCvPreviewUrlApi(): Promise<{
  url: string;
  fileName: string | null;
  expiresInSeconds: number;
}> {
  const res = await fetch("/api/v1/profile/cv/preview");
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal memuat tautan pratinjau CV.");
  }
  return json.data;
}

export async function deleteCvApi(): Promise<void> {
  const res = await fetch("/api/v1/profile/cv", { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal menghapus CV.");
  }
}
