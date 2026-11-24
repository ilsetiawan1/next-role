"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ApplicationDetailSheet } from "@/features/application-detail";
import {
  formatShortDateId,
  getCompanyInitial,
  getDaysSince,
  type ApplicationDto,
} from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { animateCountUp, ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { HomeBannerSlider } from "./HomeBannerSlider";
import { MiniCalendarCard } from "./MiniCalendarCard";

const MOBILE_FILTERS = ["Semua", "Full-time", "Hybrid", "Follow-Up", "Remote"] as const;
type MobileFilter = (typeof MOBILE_FILTERS)[number];

interface HomeOverviewProps {
  userName: string;
  isGuest?: boolean;
  initialApplications: ApplicationDto[];
}

export function HomeOverview({
  userName,
  isGuest = false,
  initialApplications,
}: HomeOverviewProps) {
  ensureGsapRegistered();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [applications, setApplications] = useState<ApplicationDto[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MobileFilter>("Semua");
  const [selectedApp, setSelectedApp] = useState<ApplicationDto | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".home-stagger-card", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });

        const statNodes = containerRef.current?.querySelectorAll<HTMLElement>("[data-home-stat]");
        statNodes?.forEach((node) => {
          const target = Number(node.dataset.target ?? "0");
          const suffix = node.dataset.suffix ?? "";
          animateCountUp(node, target, { suffix, duration: 0.85 });
        });
      });
    },
    { scope: containerRef }
  );

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
  const filtered = applications.filter((a) => {
    if (activeFilter === "Follow-Up") {
      const isFu = a.status === "FOLLOW_UP_NEEDED" || getDaysSince(a.appliedAt) >= 7;
      if (!isFu) return false;
    } else if (activeFilter !== "Semua") {
      const hay = `${a.employmentType ?? ""} ${a.location ?? ""}`.toLowerCase();
      if (!hay.includes(activeFilter.toLowerCase())) return false;
    }
    if (!q) return true;
    return (
      a.companyName.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q) ||
      (a.location ?? "").toLowerCase().includes(q)
    );
  });

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

  const statsBento = (
    <div className="glass-surface rounded-3xl p-4 sm:p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-900">Ringkasan Lamaran</h2>
        <Link
          href="/analytics"
          className="text-xs font-normal text-slate-500 hover:text-slate-900"
        >
          Bulan Ini ›
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {[
          {
            label: "Total Dilamar",
            value: String(totalApplied),
            num: totalApplied,
            suffix: "",
            icon: "/images/dashboard/icon-total-applied.png",
          },
          {
            label: "Interview Aktif",
            value: String(interviewCount),
            num: interviewCount,
            suffix: "",
            icon: "/images/dashboard/icon-interview.png",
          },
          {
            label: "Perlu Follow-Up",
            value: String(followUpDueCount),
            num: followUpDueCount,
            suffix: "",
            icon: "/images/dashboard/icon-follow-up.png",
          },
          {
            label: "Tingkat Respon",
            value: `${responseRate}%`,
            num: responseRate,
            suffix: "%",
            icon: "/images/dashboard/icon-response-rate.png",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-sky-50/55 border border-sky-100/80 p-3 flex items-center gap-2.5"
          >
            <Image
              src={stat.icon}
              alt={stat.label}
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-contain shrink-0"
            />
            <div className="min-w-0">
              <p
                data-home-stat
                data-target={stat.num}
                data-suffix={stat.suffix}
                className="text-base sm:text-lg font-medium text-slate-900 leading-none"
              >
                {stat.value}
              </p>
              <p className="text-[11px] font-normal text-slate-500 mt-1 truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function renderFollowUpCard(app: ApplicationDto, compactHorizontal = false) {
    const days = getDaysSince(app.appliedAt);
    const isDue = days >= 7 || app.status === "FOLLOW_UP_NEEDED";
    return (
      <div
        key={app.id}
        onClick={() => setSelectedApp(app)}
        className={cn(
          "home-stagger-card glass-surface rounded-2xl p-4 hover:border-sky-200 transition cursor-pointer",
          compactHorizontal && "w-[280px] shrink-0"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-medium text-sm flex items-center justify-center shrink-0">
              {getCompanyInitial(app.companyName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{app.companyName}</p>
              <p className="text-xs font-normal text-slate-500 truncate">
                {app.location ?? app.employmentType ?? "-"}
              </p>
            </div>
          </div>
          <span className="text-xs font-normal text-[#0284C7] shrink-0">Detail ↗</span>
        </div>

        <p className="mt-2.5 text-sm font-normal text-slate-900 truncate">{app.position}</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs font-normal text-slate-600 truncate">
            {app.salaryRange ?? `${days} hari lalu`}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-[11px] font-normal text-slate-400">
              {days} hari lalu
            </span>
            <span
              className={
                isDue
                  ? "rounded-xl bg-[#D4FF47] text-[#0C4A6E] px-3 py-1 text-xs font-medium"
                  : "rounded-xl bg-sky-50 text-sky-800 px-3 py-1 text-xs font-medium"
              }
            >
              {isDue ? "Follow-Up ↗" : "Buat Draf ↗"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function renderPipelineCard(app: ApplicationDto) {
    const statusDot =
      app.status === "INTERVIEW_SCHEDULED"
        ? { color: "bg-purple-600", text: `Interview • ${formatShortDateId(app.appliedAt)}` }
        : app.status === "OFFERED"
          ? { color: "bg-emerald-600", text: `Offering • ${formatShortDateId(app.appliedAt)}` }
          : null;

    return (
      <div
        key={app.id}
        onClick={() => setSelectedApp(app)}
        className="home-stagger-card glass-surface rounded-2xl p-4 hover:border-sky-200 transition cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-medium text-sm flex items-center justify-center shrink-0">
              {getCompanyInitial(app.companyName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{app.companyName}</p>
              <p className="text-xs font-normal text-slate-500 truncate">
                {app.location ?? app.employmentType ?? "-"}
              </p>
            </div>
          </div>
          <span className="text-xs font-normal text-[#0284C7] shrink-0">Detail ↗</span>
        </div>

        <p className="mt-2.5 text-sm font-normal text-slate-900 truncate">{app.position}</p>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 font-normal truncate">{app.salaryRange ?? "-"}</span>
          {statusDot ? (
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-normal shrink-0">
              <span className={cn("h-1.5 w-1.5 rounded-full", statusDot.color)} />
              {statusDot.text}
            </span>
          ) : (
            <span className="text-slate-500 font-normal shrink-0">
              Dilamar: {formatShortDateId(app.appliedAt)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-5 sm:space-y-6">
      {/* Header + Search Bar (Desktop/Tablet: Greeting left + Search right; Mobile: Search + Filter chips) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl sm:text-[28px] font-normal text-slate-900 tracking-tight">
            {userName}
          </h1>
          {!isGuest ? (
            <p className="text-sm font-normal text-slate-500 mt-0.5">
              Ringkasan ruang kerja pencarian kerjamu
            </p>
          ) : null}
        </div>

        <div className="relative w-full md:w-80">
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

      {/* Mobile Horizontal Filter Chips (EXACT FigCraft Mobile 390x844) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {MOBILE_FILTERS.map((chip) => {
          const active = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={cn(
                "h-9 px-4 rounded-full text-xs font-normal whitespace-nowrap transition shrink-0 cursor-pointer",
                active
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-sky-100"
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* MOBILE LAYOUT (< md): Banner -> Horizontal Follow-Up Carousel -> Vertical Aktivitas Terakhir */}
      <div className="md:hidden space-y-5">
        <HomeBannerSlider />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-slate-900">Perlu Tindak Lanjut</h2>
            <Link href="/roles" className="text-xs font-normal text-slate-500 hover:text-slate-900">
              Lihat semua ›
            </Link>
          </div>
          {followUpCandidates.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {followUpCandidates.map((app) => renderFollowUpCard(app, true))}
            </div>
          ) : (
            <div className="glass-surface rounded-2xl p-5 text-center text-xs text-slate-500">
              Belum ada lamaran yang melewati ambang H+7.
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-slate-900">Aktivitas Terakhir</h2>
            <Link href="/roles" className="text-xs font-normal text-slate-500 hover:text-slate-900">
              Lihat semua ›
            </Link>
          </div>
          <div className="space-y-3">
            {pipelineRecent.map((app) => renderPipelineCard(app))}
          </div>
        </section>
      </div>

      {/* TABLET LAYOUT (md..xl): Full Banner -> 2-Col (Follow-Up | Stats+Calendar) -> 2x2 Pipeline */}
      <div className="hidden md:block xl:hidden space-y-6">
        <HomeBannerSlider />

        <div className="grid grid-cols-12 gap-5 items-start">
          <section className="col-span-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Perlu Tindak Lanjut</h2>
              <Link href="/roles" className="text-xs font-semibold text-slate-600">
                Lihat semua ›
              </Link>
            </div>
            <div className="space-y-3">
              {followUpCandidates.map((app) => renderFollowUpCard(app))}
            </div>
          </section>

          <aside className="col-span-5 space-y-5">
            {statsBento}
            <MiniCalendarCard applications={applications} showWeeklyTarget={false} />
          </aside>
        </div>

        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-slate-900">Pipeline Lamaran</h2>
            <Link href="/roles" className="text-xs font-normal text-slate-500 hover:text-slate-900">
              Lihat semua ›
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pipelineRecent.map((app) => renderPipelineCard(app))}
          </div>
        </section>
      </div>

      {/* DESKTOP LAYOUT (xl+): 3-Column Balanced Grid persis FigCraft Home 1440x900 */}
      <div className="hidden xl:grid xl:grid-cols-12 gap-6 items-start">
        <div className="col-span-8 space-y-6">
          <HomeBannerSlider />

          <div className="grid grid-cols-2 gap-6">
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-slate-900">Perlu Tindak Lanjut</h2>
                <Link href="/roles" className="text-xs font-normal text-slate-500 hover:text-slate-900">
                  Lihat semua ›
                </Link>
              </div>
              <div className="space-y-3.5">
                {followUpCandidates.slice(0, 3).map((app) => renderFollowUpCard(app))}
              </div>
            </section>

            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-slate-900">Pipeline Lamaran</h2>
                <Link href="/roles" className="text-xs font-normal text-slate-500 hover:text-slate-900">
                  Lihat semua ›
                </Link>
              </div>
              <div className="space-y-3.5">
                {pipelineRecent.slice(0, 3).map((app) => renderPipelineCard(app))}
              </div>
            </section>
          </div>
        </div>

        <aside className="col-span-4 space-y-5">
          {statsBento}
          <MiniCalendarCard applications={applications} showWeeklyTarget />
        </aside>
      </div>

      {/* Detail Sheet Lamaran dari Home */}
      <ApplicationDetailSheet
        open={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
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
    </div>
  );
}
