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
  demoExpiresAt?: string | null;
  quota: {
    used: number;
    limit: number;
  };
  cv: {
    fileName: string | null;
    updatedAt: string | null;
    hasCv: boolean;
    textPreview?: string | null;
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

export function formatRemainingDemoTime(
  expiresAtIso: string | null | undefined,
  nowMs: number = Date.now()
): string | null {
  if (!expiresAtIso) return null;
  const expiresMs = new Date(expiresAtIso).getTime();
  if (Number.isNaN(expiresMs)) return null;
  const remainingMs = expiresMs - nowMs;
  if (remainingMs <= 0) return "Sesi berakhir";

  const totalMinutes = Math.floor(remainingMs / 60000);
  if (totalMinutes < 1) return "< 1 menit";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}j ${minutes}m`;
}

function escapeCsvField(value: string | null | undefined): string {
  const safe = (value ?? "").replaceAll('"', '""');
  return `"${safe}"`;
}

export function downloadApplicationsCsv(
  applications: readonly ApplicationDto[],
  fileName = "nextrole-lamaran.csv"
): void {
  const headers = [
    "Perusahaan",
    "Posisi",
    "Status",
    "Lokasi",
    "Tipe Kerja",
    "Rentang Gaji",
    "Sumber",
    "Kecocokan CV (%)",
    "Tanggal Dilamar",
    "Tautan",
  ];
  const rows = applications.map((app) =>
    [
      app.companyName,
      app.position,
      app.status,
      app.location ?? "",
      app.employmentType ?? "",
      app.salaryRange ?? "",
      app.jobSource ?? "",
      app.matchScore !== null ? String(app.matchScore) : "",
      formatShortDateId(app.appliedAt),
      app.jobUrl ?? "",
    ]
      .map(escapeCsvField)
      .join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
