export const MAX_DAILY_AI_CLIPS = 20;
export const MAX_GUEST_AI_CLIPS = 3;
export const GUEST_EMAIL_DOMAIN = "@guest.nextrole.local";
export const MAX_CV_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const FOLLOW_UP_DAYS_THRESHOLD = 7;

export function isGuestEmail(email: string): boolean {
  return email.toLowerCase().endsWith(GUEST_EMAIL_DOMAIN);
}

export function getClipQuotaLimitForEmail(email: string): number {
  return isGuestEmail(email) ? MAX_GUEST_AI_CLIPS : MAX_DAILY_AI_CLIPS;
}

export const APPLICATION_STATUSES = [
  "APPLIED",
  "FOLLOW_UP_NEEDED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "REJECTED",
  "GHOSTED",
] as const;

export type ApplicationStatusType = (typeof APPLICATION_STATUSES)[number];

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Sesi tidak valid. Silakan masuk terlebih dahulu.",
  FORBIDDEN: "Anda tidak memiliki akses ke data ini.",
  NOT_FOUND: "Data lamaran tidak ditemukan.",
  INVALID_INPUT: "Data masukan tidak valid.",
  QUOTA_EXCEEDED: "Kuota harian 20 klip AI telah tercapai. Silakan coba lagi besok.",
  PDF_TOO_LARGE: "Ukuran file PDF CV maksimal 5 MB.",
  PDF_ONLY: "Hanya file berformat PDF yang diizinkan.",
  INTERNAL_ERROR: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
} as const;
