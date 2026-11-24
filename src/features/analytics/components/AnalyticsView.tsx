"use client";

import { useState } from "react";
import { getDaysSince, type ApplicationDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { computeAnalyticsSummary } from "../utils/analyticsMetrics";

type FilterChip = "all" | "followup" | "remote" | "salary";

export function AnalyticsView({ initialApplications }: { initialApplications: ApplicationDto[] }) {
  const [filter, setFilter] = useState<FilterChip>("all");

  const filtered = initialApplications.filter((app) => {
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
  const maxSource = Math.max(1, ...summary.sources.map((s) => s.total));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analitik & Performa Karir
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Analisis efektivitas portal sumber, rasio konversi tahapan, dan tren kualifikasi lowongan
        </p>

        {/* Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: "all", label: `Semua Lamaran (${initialApplications.length})` },
            { id: "followup", label: "Perlu Follow-Up" },
            { id: "remote", label: "Hybrid & Remote" },
            { id: "salary", label: "Mencantumkan Gaji" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id as FilterChip)}
              className={cn(
                "h-9 px-4 rounded-full text-xs font-semibold transition cursor-pointer",
                filter === chip.id
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "bg-white/80 text-slate-700 border border-white hover:bg-white"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Summary Cards (sesuai FigCraft Analitik) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sky-hero-gradient rounded-3xl p-5 text-white shadow-lg shadow-sky-700/15">
          <p className="text-xs font-semibold text-sky-100">Total Lamaran</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold">{summary.total}</span>
            <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-bold text-[#0C4A6E]">
              Aktif
            </span>
          </div>
          <p className="mt-2 text-xs text-sky-100">Tersebar di 5 tahap pipeline</p>
        </div>

        <div className="glass-surface rounded-3xl p-5">
          <p className="text-xs font-semibold text-slate-500">Lolos Wawancara</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{summary.interviewRate}%</span>
            <span className="text-xs font-semibold text-[#0284C7]">
              {summary.interviewCount + summary.offerCount} / {summary.total} loker
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Konversi dari lamaran terkirim</p>
        </div>

        <div className="glass-surface rounded-3xl p-5">
          <p className="text-xs font-semibold text-slate-500">Tingkat Respon HRD</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{summary.responseRate}%</span>
            <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
              {summary.followUpDueCount} H+7
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Lamaran yang mendapat tanggapan</p>
        </div>

        <div className="glass-surface rounded-3xl p-5">
          <p className="text-xs font-semibold text-slate-500">Rata-Rata Kecocokan CV</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {summary.avgMatchScore !== null ? `${summary.avgMatchScore}%` : "—"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {summary.avgMatchScore !== null
              ? "Dihitung lokal lewat pgvector"
              : "Unggah CV di Profile untuk melihat skor"}
          </p>
        </div>
      </div>

      {/* Detailed Evaluation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Efektivitas Portal Sumber */}
        <div className="lg:col-span-7 glass-surface rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Efektivitas Portal Sumber</h2>
            <p className="text-xs text-slate-500">Volume lamaran terkirim vs lolos respon HRD</p>
          </div>

          {summary.sources.length > 0 ? (
            <div className="space-y-3.5 pt-2">
              {summary.sources.map((src) => {
                const widthPct = Math.round((src.total / maxSource) * 100);
                const respPct = src.total > 0 ? Math.round((src.responded / src.total) * 100) : 0;
                return (
                  <div key={src.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{src.name}</span>
                      <span className="text-slate-500">
                        {src.total} loker • {src.responded} respon ({respPct}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-sky-100/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#38A9E8] to-[#0284C7]"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">
              Belum ada data sumber lowongan untuk dianalisis.
            </p>
          )}
        </div>

        {/* Distribusi Tipe Kerja & Kualifikasi Teratas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-surface rounded-3xl p-6 space-y-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Distribusi Tipe Kerja</h2>
              <p className="text-xs text-slate-500">Proporsi dari {summary.total} lamaran</p>
            </div>
            {summary.employmentTypes.length > 0 ? (
              <div className="space-y-2.5">
                {summary.employmentTypes.map((emp) => (
                  <div key={emp.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{emp.name}</span>
                    <span className="font-bold text-slate-900">
                      {emp.count} ({emp.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Belum ada data tipe kerja.</p>
            )}
          </div>

          <div className="glass-surface rounded-3xl p-6 space-y-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kualifikasi Paling Diminta</h2>
              <p className="text-xs text-slate-500">Dari seluruh arsip JD lamaranmu</p>
            </div>
            {summary.topRequirements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {summary.topRequirements.map((item) => (
                  <span
                    key={item.skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-sky-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {item.skill}
                    <span className="text-[#0284C7]">{item.count}x</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Catat lamaran dengan Smart Clipper agar kualifikasi kunci terdeteksi otomatis.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
