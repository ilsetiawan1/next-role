import { getDaysSince, type ApplicationDto } from "@/features/shared/workspace-types";

export interface AnalyticsSummary {
  total: number;
  interviewCount: number;
  interviewRate: number;
  offerCount: number;
  followUpDueCount: number;
  responseRate: number;
  avgMatchScore: number | null;
  sources: Array<{ name: string; total: number; responded: number }>;
  employmentTypes: Array<{ name: string; count: number; pct: number }>;
  topRequirements: Array<{ skill: string; count: number }>;
}

/**
 * Menghitung seluruh metrik analitik karier secara deterministik dari data lamaran (0 token AI).
 */
export function computeAnalyticsSummary(
  apps: readonly ApplicationDto[],
  now: Date = new Date()
): AnalyticsSummary {
  const total = apps.length;
  const interviewCount = apps.filter((a) => a.status === "INTERVIEW_SCHEDULED").length;
  const offerCount = apps.filter((a) => a.status === "OFFERED").length;
  const respondedCount = apps.filter(
    (a) => a.status === "INTERVIEW_SCHEDULED" || a.status === "OFFERED" || a.status === "REJECTED"
  ).length;
  const followUpDueCount = apps.filter(
    (a) =>
      a.status === "FOLLOW_UP_NEEDED" ||
      (a.status === "APPLIED" && getDaysSince(a.appliedAt, now) >= 7)
  ).length;

  const scores = apps
    .map((a) => a.matchScore)
    .filter((s): s is number => typeof s === "number");
  const avgMatchScore =
    scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : null;

  const sourceMap = new Map<string, { total: number; responded: number }>();
  const empMap = new Map<string, number>();
  const skillMap = new Map<string, number>();

  for (const app of apps) {
    const src = (app.jobSource ?? "Lainnya").trim() || "Lainnya";
    const entry = sourceMap.get(src) ?? { total: 0, responded: 0 };
    entry.total += 1;
    if (
      app.status === "INTERVIEW_SCHEDULED" ||
      app.status === "OFFERED" ||
      app.status === "REJECTED"
    ) {
      entry.responded += 1;
    }
    sourceMap.set(src, entry);

    const emp = (app.employmentType ?? "Belum diisi").trim() || "Belum diisi";
    empMap.set(emp, (empMap.get(emp) ?? 0) + 1);

    for (const req of app.keyRequirements) {
      const clean = req.trim();
      if (clean.length > 0) {
        skillMap.set(clean, (skillMap.get(clean) ?? 0) + 1);
      }
    }
  }

  const sources = [...sourceMap.entries()]
    .map(([name, val]) => ({ name, ...val }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const employmentTypes = [...empMap.entries()]
    .map(([name, count]) => ({
      name,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRequirements = [...skillMap.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    total,
    interviewCount,
    interviewRate: total > 0 ? Math.round(((interviewCount + offerCount) / total) * 100) : 0,
    offerCount,
    followUpDueCount,
    responseRate: total > 0 ? Math.round((respondedCount / total) * 100) : 0,
    avgMatchScore,
    sources,
    employmentTypes,
    topRequirements,
  };
}
