import { FOLLOW_UP_DAYS_THRESHOLD } from "@/constants/application";

/**
 * Menghitung tanggal target follow-up (H+7 secara default) dari tanggal melamar.
 */
export function calculateFollowUpDate(appliedAt: Date, days = FOLLOW_UP_DAYS_THRESHOLD): Date {
  const target = new Date(appliedAt.getTime());
  target.setDate(target.getDate() + days);
  return target;
}

/**
 * Mengecek apakah dua tanggal berada pada hari UTC yang sama (untuk reset kuota harian).
 */
export function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}
