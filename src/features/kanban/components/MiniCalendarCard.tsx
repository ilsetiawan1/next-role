"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDaysSince, type ApplicationDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

interface MiniCalendarCardProps {
  applications: readonly ApplicationDto[];
  showWeeklyTarget?: boolean;
  onSelectApplication?: (app: ApplicationDto) => void;
}

export function MiniCalendarCard({
  applications,
  showWeeklyTarget = true,
  onSelectApplication,
}: MiniCalendarCardProps) {
  ensureGsapRegistered();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".cal-days-grid",
          { y: 6, opacity: 0.45 },
          { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" }
        );
      });
    },
    { scope: calendarRef, dependencies: [year, month] }
  );

  useGSAP(
    () => {
      if (selectedDay === null) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = calendarRef.current?.querySelector(".cal-selected-day");
        if (el) {
          gsap.fromTo(
            el,
            { scale: 0.82 },
            { scale: 1, duration: 0.24, ease: "back.out(2)" }
          );
        }
      });
    },
    { scope: calendarRef, dependencies: [selectedDay] }
  );
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const shortMonthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "short",
  }).format(viewMonth);

  const eventsByDay = new Map<number, ApplicationDto[]>();
  for (const app of applications) {
    const d = new Date(app.interviewAt ?? app.appliedAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate();
      const list = eventsByDay.get(dayNum);
      if (list) {
        list.push(app);
      } else {
        eventsByDay.set(dayNum, [app]);
      }
    }
  }

  const cells: Array<number | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  const weeklyTarget = 10;
  const weeklyCount = applications.filter((a) => getDaysSince(a.appliedAt) <= 7).length;
  const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));

  const isFilteredByDate = selectedDay !== null;
  const agendaItems = isFilteredByDate
    ? (eventsByDay.get(selectedDay) ?? [])
    : applications.slice(0, 3);

  return (
    <div ref={calendarRef} className="glass-surface rounded-3xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900 capitalize">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => {
              setSelectedDay(null);
              setViewMonth(new Date(year, month - 1, 1));
            }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-slate-900 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => {
              setSelectedDay(null);
              setViewMonth(new Date(year, month + 1, 1));
            }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-slate-900 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="cal-days-grid grid grid-cols-7 gap-1 text-center text-[11px]">
        {WEEKDAYS.map((day) => (
          <span key={day} className="font-normal text-slate-400 py-1">
            {day}
          </span>
        ))}
        {cells.map((day, idx) => {
          if (day === null) return <span key={`empty-${idx}`} />;
          const isSelected = day === selectedDay;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasEvent = eventsByDay.has(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay((prev) => (prev === day ? null : day))}
              className={cn(
                "h-7 w-7 mx-auto rounded-full flex flex-col items-center justify-center font-normal transition cursor-pointer relative",
                isSelected
                  ? "cal-selected-day bg-[#0284C7] text-white shadow-xs"
                  : isToday
                    ? "bg-sky-100 text-[#0284C7]"
                    : "text-slate-700 hover:bg-sky-50"
              )}
            >
              <span>{day}</span>
              {hasEvent && !isSelected ? (
                <span className="h-1 w-1 rounded-full bg-[#0284C7] absolute bottom-0.5" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Agenda & Wawancara Mendatang (Default: Terbaru; Klik tanggal: Agenda tanggal tsb) */}
      <div className="border-t border-slate-100 pt-3.5 space-y-2 min-h-[84px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-800">
            {isFilteredByDate
              ? `Agenda • ${selectedDay} ${shortMonthLabel} ${year}`
              : "Agenda & Lamaran Terbaru"}
          </p>
          {isFilteredByDate ? (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-[11px] font-normal text-[#0284C7] hover:underline cursor-pointer shrink-0"
            >
              Terbaru
            </button>
          ) : null}
        </div>
        {agendaItems.length > 0 ? (
          <ul className="space-y-1.5">
            {agendaItems.map((item) => {
              const isInterview = Boolean(item.interviewAt);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectApplication?.(item)}
                    className="w-full flex items-center gap-2 text-xs text-slate-700 hover:text-[#0284C7] transition text-left cursor-pointer"
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        isInterview ? "bg-purple-600" : "bg-[#0284C7]"
                      )}
                    />
                    <span className="truncate">
                      <span className="font-medium text-slate-900">{item.companyName}</span> —{" "}
                      {item.position}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">
            {isFilteredByDate
              ? "Tidak ada agenda lamaran pada tanggal ini."
              : "Belum ada agenda lamaran tercatat."}
          </p>
        )}
      </div>

      {/* Target Lamaran Minggu Ini (Deterministik 0 token AI) */}
      {showWeeklyTarget ? (
        <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-900">Target Lamaran Minggu Ini</p>
            <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-medium text-[#0C4A6E]">
              {weeklyCount} / {weeklyTarget}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-sky-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0284C7] transition-all"
              style={{ width: `${weeklyPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {weeklyPct}% tercapai •{" "}
            {weeklyCount >= weeklyTarget
              ? "Target minggu ini tercapai!"
              : `Sisa ${weeklyTarget - weeklyCount} lamaran lagi minggu ini`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
