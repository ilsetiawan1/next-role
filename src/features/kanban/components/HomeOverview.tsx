"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ApplicationDetailPanel } from "@/features/application-detail";
import {
  formatShortDateId,
  getCompanyInitial,
  getDaysSince,
  type ApplicationDto,
} from "@/features/shared/workspace-types";

interface HomeOverviewProps {
  userName: string;
  initialApplications: ApplicationDto[];
}

export function HomeOverview({ userName, initialApplications }: HomeOverviewProps) {
  const [applications, setApplications] = useState<ApplicationDto[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<ApplicationDto | null>(null);

  useEffect(() => {
    function handleCreated(event: Event) {
      const created = (event as CustomEvent<ApplicationDto>).detail;
      if (!created?.id) return;
      setApplications((prev) => [created, ...prev]);
    }
    window.addEventListener("nextrole:application-created", handleCreated);
    return () => window.removeEventListener("nextrole:application-created", handleCreated);
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? applications.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          (a.location ?? "").toLowerCase().includes(q)
      )
    : applications;

  const followUpCandidates = filtered
    .filter(
      (a) =>
        a.status === "FOLLOW_UP_NEEDED" ||
        (a.status === "APPLIED" && getDaysSince(a.appliedAt) >= 5)
    )
    .slice(0, 4);

  const pipelineRecent = filtered.slice(0, 4);

  const totalApplied = applications.length;
  const interviewCount = applications.filter((a) => a.status === "INTERVIEW_SCHEDULED").length;
  const followUpDueCount = applications.filter(
    (a) =>
      a.status === "FOLLOW_UP_NEEDED" ||
      (a.status === "APPLIED" && getDaysSince(a.appliedAt) >= 7)
  ).length;
  const respondedCount = applications.filter(
    (a) => a.status === "INTERVIEW_SCHEDULED" || a.status === "OFFERED" || a.status === "REJECTED"
  ).length;
  const responseRate = totalApplied > 0 ? Math.round((respondedCount / totalApplied) * 100) : 0;

  const weeklyTarget = 10;
  const weeklyCount = applications.filter((a) => getDaysSince(a.appliedAt) <= 7).length;
  const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));

  return (
    <div className="space-y-6">
      {/* Greeting + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {userName}
          </h1>
          <p className="text-sm text-slate-500">Ringkasan ruang kerja pencarian kerjamu</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Cari perusahaan atau posisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Main 3-Column Balanced Grid (sesuai FigCraft Home Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* AI Clipper Hero Banner */}
          <div className="sky-hero-gradient rounded-[28px] p-6 sm:p-7 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg shadow-sky-700/15 relative overflow-hidden">
            <div className="max-w-md z-10">
              <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                Catat Lowongan Cepat dengan Smart AI Clipper
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-sky-100 leading-relaxed">
                Tempel teks atau link lowongan, arsipkan JD permanen, dan dapatkan draf follow-up
                H+7 secara otomatis.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("nextrole:open-clipper"))}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-5 py-2.5 text-xs font-bold hover:brightness-95 transition cursor-pointer"
              >
                Coba Sekarang
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <Image
              src="/images/dashboard/banner-clipper-1.png"
              alt="Ilustrasi Smart Job Clipper"
              width={180}
              height={140}
              className="w-36 sm:w-44 h-auto object-contain shrink-0 self-end sm:self-center"
              priority
            />
          </div>

          {/* Perlu Tindak Lanjut & Pipeline Lamaran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom 1: Perlu Tindak Lanjut */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Perlu Tindak Lanjut</h2>
                <Link
                  href="/roles"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Lihat semua ›
                </Link>
              </div>

              {followUpCandidates.length > 0 ? (
                <div className="space-y-3">
                  {followUpCandidates.map((app) => {
                    const days = getDaysSince(app.appliedAt);
                    const isDue = days >= 7 || app.status === "FOLLOW_UP_NEEDED";
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="glass-surface rounded-2xl p-4 hover:border-sky-200 transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center shrink-0">
                              {getCompanyInitial(app.companyName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {app.companyName}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {app.location ?? app.employmentType ?? "-"}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#0284C7] shrink-0">
                            Detail ↗
                          </span>
                        </div>

                        <p className="mt-2.5 text-sm font-bold text-slate-900 truncate">
                          {app.position}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-600 truncate">
                            {app.salaryRange ?? `${days} hari lalu`}
                          </span>
                          <span
                            className={
                              isDue
                                ? "rounded-xl bg-[#D4FF47] text-[#0C4A6E] px-3 py-1 text-xs font-bold shrink-0"
                                : "rounded-xl bg-sky-50 text-sky-800 px-3 py-1 text-xs font-semibold shrink-0"
                            }
                          >
                            {isDue ? "Follow-Up ↗" : "Buat Draf ↗"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-surface rounded-2xl p-6 text-center">
                  <p className="text-xs font-semibold text-slate-800">Semua lamaran aman</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Belum ada lamaran yang melewati ambang H+7.
                  </p>
                </div>
              )}
            </section>

            {/* Kolom 2: Pipeline Lamaran */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Pipeline Lamaran</h2>
                <Link
                  href="/roles"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Lihat semua ›
                </Link>
              </div>

              {pipelineRecent.length > 0 ? (
                <div className="space-y-3">
                  {pipelineRecent.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="glass-surface rounded-2xl p-4 hover:border-sky-200 transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {getCompanyInitial(app.companyName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {app.companyName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {app.location ?? app.employmentType ?? "-"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#0284C7] shrink-0">
                          Detail ↗
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm font-bold text-slate-900 truncate">
                        {app.position}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-700 font-medium truncate">
                          {app.salaryRange ?? "-"}
                        </span>
                        <span className="text-slate-500 shrink-0">
                          {formatShortDateId(app.appliedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-surface rounded-2xl p-6 text-center">
                  <p className="text-xs font-semibold text-slate-800">Belum ada lamaran tercatat</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Klik tombol Catat Lamaran untuk mulai menyimpan lamaran pertamamu.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Kolom 3: Statistik & Target Mingguan */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="glass-surface rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Ringkasan Lamaran</h2>
              <Link
                href="/analytics"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Analitik ›
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Total Dilamar",
                  value: String(totalApplied),
                  icon: "/images/dashboard/icon-total-applied.png",
                },
                {
                  label: "Interview Aktif",
                  value: String(interviewCount),
                  icon: "/images/dashboard/icon-interview.png",
                },
                {
                  label: "Perlu Follow-Up",
                  value: String(followUpDueCount),
                  icon: "/images/dashboard/icon-follow-up.png",
                },
                {
                  label: "Tingkat Respon",
                  value: `${responseRate}%`,
                  icon: "/images/dashboard/icon-response-rate.png",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/85 border border-sky-100/80 p-3 flex items-center gap-3"
                >
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-xl object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold text-slate-900 leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Lamaran Minggu Ini (Deterministik 0 token AI) */}
          <div className="glass-surface rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Target Lamaran Minggu Ini</p>
              <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-xs font-bold text-[#0C4A6E]">
                {weeklyCount} / {weeklyTarget}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-sky-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0284C7] transition-all"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {weeklyPct}% tercapai •{" "}
              {weeklyCount >= weeklyTarget
                ? "Target minggu ini sudah tercapai!"
                : `Sisa ${weeklyTarget - weeklyCount} lamaran lagi minggu ini`}
            </p>
          </div>
        </aside>
      </div>

      {/* Modal Detail dari Home */}
      <Modal
        open={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
        title={selectedApp ? `${selectedApp.companyName} — ${selectedApp.position}` : "Detail Lamaran"}
      >
        <ApplicationDetailPanel
          application={selectedApp}
          onStatusUpdated={(updated) => {
            setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setSelectedApp(updated);
          }}
          onDeleted={(id) => {
            setApplications((prev) => prev.filter((a) => a.id !== id));
            setSelectedApp(null);
          }}
        />
      </Modal>
    </div>
  );
}
