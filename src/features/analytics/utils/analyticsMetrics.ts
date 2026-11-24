import { getDaysSince, type ApplicationDto } from "@/features/shared/workspace-types";

export interface AnalyticsSummary {
  total: number;
  interviewCount: number;
  interviewRate: number;
  offerCount: number;
  offerRate: number;
  followUpDueCount: number;
  responseRate: number;
  avgMatchScore: number | null;
  sources: Array<{ name: string; total: number; responded: number; responseRate: number }>;
  employmentTypes: Array<{ name: string; count: number; pct: number }>;
  workModes: Array<{ name: "Hybrid" | "Remote" | "On-Site"; count: number; pct: number }>;
  topWorkMode: string;
  topRequirements: Array<{ skill: string; count: number; pct: number }>;
  weeklyTrend: Array<{ label: string; applied: number; responded: number }>;
  heatmapCells: Array<{ weekIndex: number; dayIndex: number; count: number }>;
}

function classifyWorkMode(location: string | null, employmentType: string | null): "Hybrid" | "Remote" | "On-Site" {
  const hay = `${location ?? ""} ${employmentType ?? ""}`.toLowerCase();
  if (hay.includes("remote")) return "Remote";
  if (hay.includes("hybrid")) return "Hybrid";
  return "On-Site";
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
  const workModeCounts: Record<"Hybrid" | "Remote" | "On-Site", { total: number; responded: number }> = {
    Hybrid: { total: 0, responded: 0 },
    Remote: { total: 0, responded: 0 },
    "On-Site": { total: 0, responded: 0 },
  };

  // 4-week trend buckets (Mgg 1 = oldest, Mgg 4 = most recent 7 days)
  const weekBuckets = [
    { label: "Mgg 1", applied: 0, responded: 0 },
    { label: "Mgg 2", applied: 0, responded: 0 },
    { label: "Mgg 3", applied: 0, responded: 0 },
    { label: "Mgg 4", applied: 0, responded: 0 },
  ];

  // 4x7 heatmap (28 days)
  const heatmapGrid = Array.from({ length: 28 }, () => 0);

  for (const app of apps) {
    const isResponded =
      app.status === "INTERVIEW_SCHEDULED" ||
      app.status === "OFFERED" ||
      app.status === "REJECTED";

    const src = (app.jobSource ?? "Lainnya").trim() || "Lainnya";
    const entry = sourceMap.get(src) ?? { total: 0, responded: 0 };
    entry.total += 1;
    if (isResponded) entry.responded += 1;
    sourceMap.set(src, entry);

    const emp = (app.employmentType ?? "Belum diisi").trim() || "Belum diisi";
    empMap.set(emp, (empMap.get(emp) ?? 0) + 1);

    const mode = classifyWorkMode(app.location, app.employmentType);
    workModeCounts[mode].total += 1;
    if (isResponded) workModeCounts[mode].responded += 1;

    for (const req of app.keyRequirements) {
      const clean = req.trim();
      if (clean.length > 0) {
        skillMap.set(clean, (skillMap.get(clean) ?? 0) + 1);
      }
    }

    const daysAgo = getDaysSince(app.appliedAt, now);
    if (daysAgo < 28) {
      const bucketIdx = Math.min(3, Math.max(0, 3 - Math.floor(daysAgo / 7)));
      weekBuckets[bucketIdx].applied += 1;
      if (isResponded) weekBuckets[bucketIdx].responded += 1;

      const cellIdx = 27 - daysAgo;
      if (cellIdx >= 0 && cellIdx < 28) {
        heatmapGrid[cellIdx] += 1;
      }
    }
  }

  const sources = [...sourceMap.entries()]
    .map(([name, val]) => ({
      name,
      total: val.total,
      responded: val.responded,
      responseRate: val.total > 0 ? Math.round((val.responded / val.total) * 100) : 0,
    }))
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

  const workModes: Array<{ name: "Hybrid" | "Remote" | "On-Site"; count: number; pct: number }> = (
    ["Hybrid", "Remote", "On-Site"] as const
  ).map((name) => ({
    name,
    count: workModeCounts[name].total,
    pct: total > 0 ? Math.round((workModeCounts[name].total / total) * 100) : 0,
  }));

  const sortedWorkModes = [...workModes].sort((a, b) => b.count - a.count);
  const topWorkMode = sortedWorkModes[0]?.count > 0 ? sortedWorkModes[0].name : "Hybrid";

  const topRequirements = [...skillMap.entries()]
    .map(([skill, count]) => ({
      skill,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const heatmapCells = heatmapGrid.map((count, idx) => ({
    weekIndex: Math.floor(idx / 7),
    dayIndex: idx % 7,
    count,
  }));

  return {
    total,
    interviewCount,
    interviewRate: total > 0 ? Math.round(((interviewCount + offerCount) / total) * 100) : 0,
    offerCount,
    offerRate: total > 0 ? Math.round((offerCount / total) * 100) : 0,
    followUpDueCount,
    responseRate: total > 0 ? Math.round((respondedCount / total) * 100) : 0,
    avgMatchScore,
    sources,
    employmentTypes,
    workModes,
    topWorkMode,
    topRequirements,
    weeklyTrend: weekBuckets,
    heatmapCells,
  };
}
