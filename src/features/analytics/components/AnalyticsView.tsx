"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { getDaysSince, type ApplicationDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { animateCountUp, ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { computeAnalyticsSummary } from "../utils/analyticsMetrics";
import { openAnalyticsPdfReport } from "../utils/analyticsPdfReport";

type FilterChip = "all" | "followup" | "remote" | "salary";
type PeriodFilter = "30d" | "all";
type TrendMode = "week" | "month";

const WORK_MODE_COLORS: Record<"Hybrid" | "Remote" | "On-Site", string> = {
  Hybrid: "#0284C7",
  Remote: "#38BDF8",
  "On-Site": "#BAE6FD",
};

const DAY_HEADERS = ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"] as const;
const WEEK_LABELS = ["M1", "M2", "M3", "M4"] as const;

function SegmentedGauge({ percentage }: { percentage: number }) {
  const totalSegments = 16;
  const filledSegments = Math.round(
    (Math.min(100, Math.max(0, percentage)) / 100) * totalSegments
  );
  const cx = 100;
  const cy = 92;
  const outerR = 76;
  const innerR = 54;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 106" className="w-44 xl:w-48 h-24 overflow-visible" aria-hidden="true">
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const step = 180 / totalSegments;
          const startDeg = 180 - idx * step - 1.8;
          const endDeg = 180 - (idx + 1) * step + 1.8;
          const sRad = (startDeg * Math.PI) / 180;
          const eRad = (endDeg * Math.PI) / 180;

          const x1 = (cx + outerR * Math.cos(sRad)).toFixed(2);
          const y1 = (cy - outerR * Math.sin(sRad)).toFixed(2);
          const x2 = (cx + outerR * Math.cos(eRad)).toFixed(2);
          const y2 = (cy - outerR * Math.sin(eRad)).toFixed(2);
          const x3 = (cx + innerR * Math.cos(eRad)).toFixed(2);
          const y3 = (cy - innerR * Math.sin(eRad)).toFixed(2);
          const x4 = (cx + innerR * Math.cos(sRad)).toFixed(2);
          const y4 = (cy - innerR * Math.sin(sRad)).toFixed(2);

          const isFilled = idx < filledSegments;
          const fill = isFilled
            ? idx < filledSegments / 2
              ? "#0284C7"
              : "#38BDF8"
            : "#E8F1FA";

          return (
            <path
              key={idx}
              className="analytics-gauge-seg"
              d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`}
              fill={fill}
            />
          );
        })}
      </svg>
      <div className="-mt-9 text-center">
        <p className="text-2xl font-medium text-slate-900 leading-none">{percentage}%</p>
        <p className="text-[11px] font-normal text-slate-500 mt-1">Lolos Wawancara</p>
      </div>
    </div>
  );
}

function WorkModeDonut({
  total,
  workModes,
  sizeClass = "h-24 w-24",
}: {
  total: number;
  workModes: Array<{ name: "Hybrid" | "Remote" | "On-Site"; count: number; pct: number }>;
  sizeClass?: string;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;
  const segments = workModes.reduce<
    Array<{ name: "Hybrid" | "Remote" | "On-Site"; dash: number; offset: number }>
  >((acc, mode) => {
    const prevUsed = acc.reduce((sum, item) => sum + item.dash, 0);
    const dash = total > 0 ? (mode.count / total) * circumference : 0;
    acc.push({ name: mode.name, dash, offset: prevUsed });
    return acc;
  }, []);

  return (
    <div className={cn("analytics-donut relative shrink-0", sizeClass)}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#EFF6FF" strokeWidth="13" />
        {total > 0
          ? segments.map((seg) =>
              seg.dash > gap ? (
                <circle
                  key={seg.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={WORK_MODE_COLORS[seg.name]}
                  strokeWidth="13"
                  strokeDasharray={`${Math.max(1, seg.dash - gap).toFixed(2)} ${circumference.toFixed(2)}`}
                  strokeDashoffset={(-seg.offset).toFixed(2)}
                />
              ) : null
            )
          : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-base font-medium text-slate-900 leading-none">{total}</span>
        <span className="text-[10px] font-normal text-slate-500 mt-0.5">Total Loker</span>
      </div>
    </div>
  );
}

export function AnalyticsView({
  initialApplications,
  userName = "Pengguna NextRole",
  userEmail = "",
}: {
  initialApplications: ApplicationDto[];
  userName?: string;
  userEmail?: string;
}) {
  ensureGsapRegistered();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<FilterChip>("all");
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [trendMode, setTrendMode] = useState<TrendMode>("week");
  const [selectedSourceIdx, setSelectedSourceIdx] = useState(0);

  const periodFiltered =
    period === "30d"
      ? initialApplications.filter((a) => getDaysSince(a.appliedAt) <= 30)
      : initialApplications;

  const filtered = periodFiltered.filter((app) => {
    if (filter === "followup") {
      return (
        app.status === "FOLLOW_UP_NEEDED" ||
        (app.status === "APPLIED" && getDaysSince(app.appliedAt) >= 7)
      );
    }
    if (filter === "remote") {
      const hay = `${app.location ?? ""} ${app.employmentType ?? ""}`.toLowerCase();
      return hay.includes("remote") || hay.includes("hybrid");
    }
    if (filter === "salary") {
      return Boolean(app.salaryRange && app.salaryRange.trim().length > 0);
    }
    return true;
  });

  const summary = computeAnalyticsSummary(filtered);
  const maxSource = Math.max(4, ...summary.sources.map((s) => s.total));
  const yMid = Math.round(maxSource / 2);
  const safeSelectedIdx = selectedSourceIdx < summary.sources.length ? selectedSourceIdx : 0;
  const highlightedSource = summary.sources[safeSelectedIdx] ?? null;

  const followUpTotalCount = periodFiltered.filter(
    (app) =>
      app.status === "FOLLOW_UP_NEEDED" ||
      (app.status === "APPLIED" && getDaysSince(app.appliedAt) >= 7)
  ).length;

  // GSAP initial staggered entrance for dashboard cards
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".analytics-card", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: rootRef }
  );

  // GSAP counter-up, bar/gauge/donut/line/heatmap growth when filter or period changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const statNodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-analytics-stat]");
        statNodes?.forEach((node) => {
          const target = Number(node.dataset.target ?? "0");
          const suffix = node.dataset.suffix ?? "";
          const padZero = node.dataset.pad === "true";
          animateCountUp(node, target, { suffix, padZero, duration: 0.75 });
        });

        gsap.fromTo(
          ".analytics-bar-col",
          { scaleY: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 0.52,
            stagger: 0.055,
            ease: "power3.out",
            clearProps: "transform",
          }
        );

        gsap.fromTo(
          ".analytics-gauge-seg",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, stagger: 0.02, ease: "power1.out" }
        );

        gsap.fromTo(
          ".analytics-donut",
          { scale: 0.9, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out", clearProps: "transform" }
        );

        const trendLine = rootRef.current?.querySelector<SVGPathElement>(".analytics-trend-line");
        if (trendLine) {
          const len = trendLine.getTotalLength();
          gsap.fromTo(
            trendLine,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }
          );
        }

        gsap.fromTo(
          ".analytics-heat-cell",
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.28,
            stagger: { amount: 0.28, from: "start" },
            ease: "power2.out",
            clearProps: "transform",
          }
        );
      });
    },
    { scope: rootRef, dependencies: [filter, period, trendMode] }
  );

  // Smooth GSAP pop on portal tooltip when user clicks another portal column
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".analytics-portal-tooltip",
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.24, ease: "power2.out", clearProps: "transform" }
        );
      });
    },
    { scope: rootRef, dependencies: [safeSelectedIdx] }
  );

  // Weekly trend SVG points
  const maxTrend = Math.max(1, ...summary.weeklyTrend.map((w) => w.applied));
  const trendPoints = summary.weeklyTrend.map((w, idx) => {
    const x = 18 + idx * 88;
    const y = 70 - Math.round((w.applied / maxTrend) * 44);
    return { ...w, x, y };
  });
  const linePath = trendPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    trendPoints.length > 0
      ? `${linePath} L ${trendPoints[trendPoints.length - 1].x} 78 L ${trendPoints[0].x} 78 Z`
      : "";
  const latestTrend = trendPoints[trendPoints.length - 1];
  const maxHeat = Math.max(1, ...summary.heatmapCells.map((c) => c.count));

  const portalChartCard = (
    <div className="analytics-card glass-surface rounded-3xl p-4 sm:p-5 xl:p-4 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-medium text-slate-900">
            <span className="sm:hidden">Efektivitas Portal</span>
            <span className="hidden sm:inline">Efektivitas Portal Sumber</span>
          </h2>
          <p className="hidden sm:block text-xs font-normal text-slate-500">
            Volume lamaran terkirim vs lolos tahap respon HRD
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-normal text-slate-500 shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="sm:hidden">Kirim</span>
            <span className="hidden sm:inline">Terkirim</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
            <span className="sm:hidden">Lolos</span>
            <span className="hidden sm:inline">Lolos Respon</span>
          </span>
        </div>
      </div>

      {summary.sources.length > 0 ? (
        <div className="relative mt-3 pt-1">
          {highlightedSource ? (
            <div className="analytics-portal-tooltip mb-2.5 sm:mb-0 sm:absolute sm:top-0 sm:right-2 z-20 pointer-events-none inline-flex flex-col rounded-2xl bg-white/95 backdrop-blur-md border border-sky-100 shadow-md shadow-sky-900/10 px-3 py-1.5 text-[11px]">
              <span className="font-medium text-slate-900">
                {highlightedSource.name} ({highlightedSource.responseRate}% respon)
              </span>
              <div className="mt-0.5 flex items-center gap-3 text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  Terkirim: <span className="text-slate-800">{highlightedSource.total} loker</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#0284C7]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                  Lolos: <span className="font-medium">{highlightedSource.responded} loker</span>
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-44 xl:h-38">
            <div className="h-full flex flex-col justify-between pb-5 text-[10px] text-slate-400 text-right w-5 shrink-0">
              <span>{maxSource}</span>
              <span>{yMid}</span>
              <span>0</span>
            </div>

            <div className="flex-1 h-full relative flex flex-col">
              <div className="absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-slate-100" />
                <div className="border-t border-slate-100" />
                <div className="border-t border-slate-100" />
              </div>

              <div className="relative z-10 flex-1 grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-5 items-end px-1 sm:px-3">
                {summary.sources.slice(0, 5).map((src, idx) => {
                  const totalHeightPct = Math.max(22, Math.round((src.total / maxSource) * 100));
                  const respondedHeightPct =
                    src.total > 0 ? Math.round((src.responded / src.total) * 100) : 0;
                  const isSelected = idx === safeSelectedIdx;

                  return (
                    <button
                      key={src.name}
                      type="button"
                      onClick={() => setSelectedSourceIdx(idx)}
                      className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    >
                      <div className="w-full max-w-14 flex-1 flex items-end justify-center">
                        <div
                          className="analytics-bar-col w-full rounded-t-2xl bg-[#EEF4FB] relative overflow-hidden"
                          style={{ height: `${totalHeightPct}%` }}
                        >
                          <div
                            className={cn(
                              "absolute bottom-0 inset-x-0 rounded-t-2xl transition-all flex justify-center",
                              isSelected
                                ? "bg-linear-to-b from-[#0EA5E9] to-[#38BDF8]/80"
                                : "bg-linear-to-b from-slate-400/75 to-slate-400/50 group-hover:from-sky-400 group-hover:to-sky-300"
                            )}
                            style={{
                              height: `${Math.max(respondedHeightPct, src.responded > 0 ? 28 : 16)}%`,
                            }}
                          >
                            {isSelected ? (
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-[11px] truncate max-w-full",
                          isSelected ? "font-medium text-[#0284C7]" : "font-normal text-slate-500"
                        )}
                      >
                        {src.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 py-8 text-center">
          Belum ada data sumber lowongan untuk dianalisis.
        </p>
      )}
    </div>
  );

  const pipelineGaugeCard = (
    <div className="analytics-card glass-surface rounded-3xl p-4 sm:p-5 xl:p-4 flex flex-col justify-between h-full space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-medium text-slate-900">Konversi Pipeline</h2>
          <p className="text-xs font-normal text-slate-500">
            Rasio lolos wawancara dari {summary.total} lamaran aktif
          </p>
        </div>
        <span className="rounded-full bg-sky-50 border border-sky-100 px-2.5 py-0.5 text-[11px] font-normal text-[#0284C7] shrink-0">
          {summary.total} Aktif
        </span>
      </div>

      <SegmentedGauge percentage={summary.interviewRate} />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-3.5 py-2.5">
          <p className="text-[11px] font-normal text-slate-500">Perlu Follow-Up</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-medium text-slate-900 leading-none">
              {summary.followUpDueCount}
            </span>
            <span className="rounded-full bg-[#D4FF47] px-2 py-0.5 text-[10px] font-medium text-[#0C4A6E]">
              H+7
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-3.5 py-2.5">
          <p className="text-[11px] font-normal text-slate-500">Offering Final</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-medium text-slate-900 leading-none">
              {summary.offerCount}
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-normal text-emerald-700">
              ↑ {summary.offerRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const trendCard = (
    <div className="analytics-card glass-surface rounded-3xl p-4 sm:p-5 xl:p-4 flex flex-col justify-between h-full space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-medium text-slate-900">Tren Respon HRD</h2>
          <p className="text-xs font-normal text-slate-500">Aktivitas lamaran (Mg 1 – Mg 4)</p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100/90 p-0.5 text-[11px]">
          {(
            [
              { id: "week", label: "Minggu" },
              { id: "month", label: "Bulan" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTrendMode(opt.id)}
              className={cn(
                "px-2.5 py-0.5 rounded-full transition cursor-pointer",
                trendMode === opt.id
                  ? "bg-white text-slate-900 font-medium shadow-xs"
                  : "text-slate-500 font-normal"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative pt-3">
        {latestTrend ? (
          <div className="absolute top-0 right-10 z-10 rounded-xl bg-white/95 border border-sky-100 shadow-sm px-2.5 py-1 text-[10px] pointer-events-none">
            <p className="font-medium text-[#0284C7]">
              {latestTrend.label} · {latestTrend.applied} lamaran
            </p>
            <p className="text-slate-400">Aktivitas terbaru</p>
          </div>
        ) : null}

        <svg
          viewBox="0 0 300 94"
          className="w-full h-28 xl:h-26 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="trendActiveCol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Y-axis ticks */}
          <text x="2" y="27" className="fill-slate-400 text-[9px]">
            {maxTrend}
          </text>
          <text x="2" y="53" className="fill-slate-400 text-[9px]">
            {Math.max(1, Math.round(maxTrend / 2))}
          </text>
          <text x="2" y="79" className="fill-slate-400 text-[9px]">
            0
          </text>

          <line x1="18" y1="24" x2="290" y2="24" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="18" y1="50" x2="290" y2="50" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="18" y1="78" x2="290" y2="78" stroke="#E2E8F0" strokeWidth="1" />

          {/* Vertical translucent highlight column under latest week (persis FigCraft) */}
          {latestTrend ? (
            <rect
              x={latestTrend.x - 10}
              y={latestTrend.y}
              width="20"
              height={Math.max(4, 78 - latestTrend.y)}
              rx="6"
              fill="url(#trendActiveCol)"
            />
          ) : null}

          {areaPath ? <path d={areaPath} fill="url(#trendAreaGrad)" /> : null}
          {linePath ? (
            <path
              className="analytics-trend-line"
              d={linePath}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {trendPoints.map((pt, idx) => (
            <g key={pt.label}>
              {idx === trendPoints.length - 1 ? (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                />
              ) : null}
              <text
                x={pt.x}
                y="92"
                textAnchor="middle"
                className={cn(
                  "text-[10px]",
                  idx === trendPoints.length - 1 ? "fill-[#0284C7] font-medium" : "fill-slate-400"
                )}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );

  const workModeCard = (
    <div className="analytics-card glass-surface rounded-3xl p-4 sm:p-5 xl:p-4 flex flex-col justify-between h-full space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-medium text-slate-900">
            <span className="sm:hidden">Tipe Kerja &amp; Skill</span>
            <span className="hidden sm:inline">Distribusi Tipe Kerja</span>
          </h2>
          <p className="hidden sm:block text-xs font-normal text-slate-500">
            Sebaran berdasarkan sistem kerja
          </p>
        </div>
        <span className="sm:hidden text-xs font-normal text-[#0284C7]">{summary.total} Loker</span>
      </div>

      <div className="flex items-center gap-4">
        <WorkModeDonut total={summary.total} workModes={summary.workModes} sizeClass="h-24 w-24" />
        <div className="flex-1 space-y-2">
          {summary.workModes.map((mode) => (
            <div key={mode.name} className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-800 font-normal">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: WORK_MODE_COLORS[mode.name] }}
                />
                {mode.name}
              </span>
              <span className="text-slate-700 font-normal shrink-0">
                {mode.pct}% <span className="text-slate-400">({mode.count})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sky Callout Pill on Tablet/Desktop (persis FigCraft!) */}
      <div className="hidden sm:block rounded-xl bg-sky-50/80 border border-sky-100 px-3 py-1.5 text-[11px] font-normal text-[#0284C7] truncate">
        Dominasi sistem kerja: <span className="font-medium">{summary.topWorkMode}</span> (
        {summary.workModes.find((m) => m.name === summary.topWorkMode)?.pct ?? 0}% dari total)
      </div>

      <p className="sm:hidden text-[11px] font-normal text-slate-500 pt-2 border-t border-slate-100 truncate">
        Skill:{" "}
        {summary.topRequirements.length > 0
          ? summary.topRequirements
              .slice(0, 3)
              .map((r) => `${r.skill} ${r.pct}%`)
              .join(" · ")
          : "Catat lamaran dengan AI Clipper"}
      </p>
    </div>
  );

  const heatmapCard = (
    <div className="analytics-card glass-surface rounded-3xl p-4 sm:p-5 xl:p-4 flex flex-col justify-between h-full space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm sm:text-base font-medium text-slate-900">
          Aktivitas &amp; Skill
        </h2>
        <span className="text-[11px] font-normal text-slate-400">4 minggu terakhir</span>
      </div>

      <div className="space-y-1.5">
        {/* Column Day Headers (Sn Sl Rb Km Jm Sb Mg — persis FigCraft!) */}
        <div className="grid grid-cols-8 gap-1.5 items-center text-center">
          <span />
          {DAY_HEADERS.map((d) => (
            <span key={d} className="text-[10px] font-normal text-slate-400">
              {d}
            </span>
          ))}
        </div>

        {/* 4 Week Rows (M1..M4) x 7 Days */}
        {WEEK_LABELS.map((weekLabel, weekIdx) => (
          <div key={weekLabel} className="grid grid-cols-8 gap-1.5 items-center">
            <span
              className={cn(
                "text-[10px]",
                weekIdx === 3 ? "text-[#0284C7] font-medium" : "text-slate-400"
              )}
            >
              {weekLabel}
            </span>
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const cell = summary.heatmapCells[weekIdx * 7 + dayIdx];
              const count = cell?.count ?? 0;
              const isPeak = count > 0 && count === maxHeat && weekIdx === 3 && dayIdx === 3;
              const bg = isPeak
                ? "bg-[#D4FF47]"
                : count >= 3
                  ? "bg-[#0284C7]"
                  : count === 2
                    ? "bg-[#38BDF8]"
                    : count === 1
                      ? "bg-[#BAE6FD]"
                      : "bg-[#EEF5FC]";
              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  title={`${count} lamaran`}
                  className={cn("analytics-heat-cell h-4 sm:h-4.5 rounded-[5px]", bg)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-500 font-normal truncate">
          Skill:{" "}
          {summary.topRequirements.length > 0
            ? summary.topRequirements
                .slice(0, 3)
                .map((r) => `${r.skill} (${r.pct}%)`)
                .join(" · ")
            : "Belum terdeteksi"}
        </span>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="space-y-4 xl:space-y-3.5">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight">
            Analitik &amp; Performa Karir
          </h1>
          <p className="text-xs font-normal text-slate-500 mt-0.5">
            <span className="sm:hidden">Efektivitas portal, konversi pipeline &amp; loker</span>
            <span className="hidden sm:inline">
              Analisis efektivitas portal sumber, rasio konversi tahapan, dan tren kualifikasi
              lowongan
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPeriod((p) => (p === "30d" ? "all" : "30d"))}
            className="hidden sm:inline-flex items-center h-8 px-3.5 rounded-full bg-white border border-sky-100 text-xs font-normal text-slate-700 hover:bg-sky-50 transition cursor-pointer"
          >
            {period === "30d" ? "30 Hari Terakhir" : "Semua Waktu"}
          </button>

          <button
            type="button"
            onClick={() =>
              openAnalyticsPdfReport({
                userName,
                userEmail,
                periodLabel: period === "30d" ? "30 Hari Terakhir" : "Semua Waktu",
                applications: filtered,
                summary,
              })
            }
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh PDF
          </button>

          <button
            type="button"
            aria-label="Unduh laporan PDF"
            onClick={() =>
              openAnalyticsPdfReport({
                userName,
                userEmail,
                periodLabel: period === "30d" ? "30 Hari Terakhir" : "Semua Waktu",
                applications: filtered,
                summary,
              })
            }
            className="sm:hidden h-9 w-9 rounded-full bg-white border border-sky-100 text-[#0284C7] flex items-center justify-center shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          type="button"
          onClick={() => setPeriod((p) => (p === "30d" ? "all" : "30d"))}
          className="sm:hidden h-8 px-3.5 rounded-full bg-white border border-sky-100 text-xs font-normal text-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {period === "30d" ? "30 Hari Terakhir" : "Semua Waktu"}
        </button>
        {[
          { id: "all", label: `Semua Lamaran (${periodFiltered.length})` },
          { id: "followup", label: `Follow-Up (${followUpTotalCount})` },
          { id: "remote", label: "Hybrid & Remote" },
          { id: "salary", label: "Mencantumkan Gaji" },
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id as FilterChip)}
            className={cn(
              "h-8 px-3.5 rounded-full text-xs whitespace-nowrap transition shrink-0 cursor-pointer",
              filter === chip.id
                ? "bg-[#0284C7] text-white font-medium shadow-xs"
                : "bg-white/90 text-slate-600 font-normal border border-sky-100/80 hover:bg-white"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* MOBILE: Compact 2x2 Unified KPI Card with Hairline Dividers */}
      <div className="analytics-card sm:hidden glass-surface rounded-3xl overflow-hidden grid grid-cols-2">
        <div className="p-3.5 border-r border-b border-slate-100">
          <p className="text-[11px] font-normal text-slate-500">Total Lamaran</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              data-analytics-stat
              data-target={summary.total}
              className="text-xl font-medium text-slate-900"
            >
              {summary.total}
            </span>
            <span className="rounded-full bg-[#D4FF47] px-2 py-0.5 text-[10px] font-medium text-[#0C4A6E]">
              Aktif
            </span>
          </div>
        </div>
        <div className="p-3.5 border-b border-slate-100">
          <p className="text-[11px] font-normal text-slate-500">Lolos Wawancara</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              data-analytics-stat
              data-target={summary.interviewRate}
              data-suffix="%"
              className="text-xl font-medium text-slate-900"
            >
              {summary.interviewRate}%
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-normal text-emerald-700">
              {summary.interviewCount + summary.offerCount}/{summary.total}
            </span>
          </div>
        </div>
        <div className="p-3.5 border-r border-slate-100">
          <p className="text-[11px] font-normal text-slate-500">Respon HRD</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              data-analytics-stat
              data-target={summary.responseRate}
              data-suffix="%"
              className="text-xl font-medium text-slate-900"
            >
              {summary.responseRate}%
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-normal text-[#0284C7]">
              {summary.followUpDueCount} H+7
            </span>
          </div>
        </div>
        <div className="p-3.5">
          <p className="text-[11px] font-normal text-slate-500">Offering Final</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              data-analytics-stat
              data-target={summary.offerCount}
              data-pad="true"
              className="text-xl font-medium text-slate-900"
            >
              {String(summary.offerCount).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-normal text-emerald-700">
              {summary.offerRate}% lolos
            </span>
          </div>
        </div>
      </div>

      {/* TABLET & DESKTOP: 4 KPI Cards (compact xl:p-4 so entire Desktop fits in 1 screen) */}
      <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="analytics-card sky-hero-gradient rounded-[22px] p-4 text-white shadow-lg shadow-sky-700/15 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-normal text-sky-100">Total Lamaran</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  data-analytics-stat
                  data-target={summary.total}
                  className="text-2xl xl:text-[26px] font-medium leading-none"
                >
                  {summary.total}
                </span>
                <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-medium text-[#0C4A6E]">
                  Aktif
                </span>
              </div>
            </div>
            <span className="h-10 w-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 p-1.5">
              <Image
                src="/images/dashboard/icon-total-applied.png"
                alt="Total Lamaran"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
          </div>
          <p className="mt-2 text-[11px] font-normal text-sky-100">Aktif di 5 tahap pipeline</p>
        </div>

        <div className="analytics-card glass-surface rounded-[22px] p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-normal text-slate-500">Lolos Wawancara</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  data-analytics-stat
                  data-target={summary.interviewRate}
                  data-suffix="%"
                  className="text-2xl xl:text-[26px] font-medium text-slate-900 leading-none"
                >
                  {summary.interviewRate}%
                </span>
                <span className="rounded-full bg-sky-50 border border-sky-100 px-2 py-0.5 text-[11px] font-normal text-[#0284C7]">
                  {summary.interviewCount + summary.offerCount}/{summary.total} loker
                </span>
              </div>
            </div>
            <span className="h-10 w-10 rounded-xl bg-sky-50/90 border border-sky-100/80 flex items-center justify-center shrink-0 p-1.5">
              <Image
                src="/images/dashboard/icon-interview.png"
                alt="Lolos Wawancara"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
          </div>
          <p className="mt-2 text-[11px] font-normal text-slate-500">
            Konversi dari lamaran terkirim
          </p>
        </div>

        <div className="analytics-card glass-surface rounded-[22px] p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-normal text-slate-500">Tingkat Respon HRD</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  data-analytics-stat
                  data-target={summary.responseRate}
                  data-suffix="%"
                  className="text-2xl xl:text-[26px] font-medium text-slate-900 leading-none"
                >
                  {summary.responseRate}%
                </span>
                <span className="rounded-full bg-[#D4FF47] px-2 py-0.5 text-[11px] font-medium text-[#0C4A6E]">
                  {summary.followUpDueCount} H+7
                </span>
              </div>
            </div>
            <span className="h-10 w-10 rounded-xl bg-sky-50/90 border border-sky-100/80 flex items-center justify-center shrink-0 p-1.5">
              <Image
                src="/images/dashboard/icon-follow-up.png"
                alt="Tingkat Respon HRD"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
          </div>
          <p className="mt-2 text-[11px] font-normal text-slate-500">
            Dari tanggal lamaran terkirim
          </p>
        </div>

        <div className="analytics-card glass-surface rounded-[22px] p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-normal text-slate-500">Rata-Rata Kecocokan CV</p>
              <div className="mt-1 flex items-center gap-2">
                {summary.avgMatchScore !== null ? (
                  <span
                    data-analytics-stat
                    data-target={summary.avgMatchScore}
                    data-suffix="%"
                    className="text-2xl xl:text-[26px] font-medium text-slate-900 leading-none"
                  >
                    {summary.avgMatchScore}%
                  </span>
                ) : (
                  <span className="text-2xl xl:text-[26px] font-medium text-slate-900 leading-none">
                    —
                  </span>
                )}
                {summary.offerCount > 0 ? (
                  <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[11px] font-normal text-emerald-700">
                    {summary.offerCount} Offering
                  </span>
                ) : null}
              </div>
            </div>
            <span className="h-10 w-10 rounded-xl bg-sky-50/90 border border-sky-100/80 flex items-center justify-center shrink-0 p-1.5">
              <Image
                src="/images/dashboard/icon-response-rate.png"
                alt="Rata-Rata Kecocokan CV"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
          </div>
          <p className="mt-2 text-[11px] font-normal text-slate-500">
            {summary.avgMatchScore !== null
              ? "Dihitung otomatis dari profil CV-mu"
              : "Unggah CV di Profile untuk skor"}
          </p>
        </div>
      </div>

      {/* MOBILE LAYOUT (< md) */}
      <div className="md:hidden space-y-4">
        {portalChartCard}
        {workModeCard}
        {pipelineGaugeCard}
        {trendCard}
      </div>

      {/* TABLET LAYOUT (md..xl) */}
      <div className="hidden md:block xl:hidden space-y-4">
        {portalChartCard}
        <div className="grid grid-cols-2 gap-4 items-stretch">
          {pipelineGaugeCard}
          {workModeCard}
        </div>
        <div className="grid grid-cols-2 gap-4 items-stretch">
          {trendCard}
          {heatmapCard}
        </div>
      </div>

      {/* DESKTOP LAYOUT (xl+): 1-Screen Fit (Zero Scroll on 1440x900) */}
      <div className="hidden xl:block space-y-3.5">
        <div className="grid grid-cols-12 gap-3.5 items-stretch">
          <div className="col-span-7">{portalChartCard}</div>
          <div className="col-span-5">{pipelineGaugeCard}</div>
        </div>
        <div className="grid grid-cols-3 gap-3.5 items-stretch">
          {trendCard}
          {workModeCard}
          {heatmapCard}
        </div>
      </div>
    </div>
  );
}
