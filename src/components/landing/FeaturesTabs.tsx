"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type FeatureId = "clipper" | "cvmatch" | "archive" | "kanban" | "followup";

const FEATURE_TABS: Array<{
  id: FeatureId;
  label: string;
  eyebrow: string;
  title: string;
  shortDescription?: string;
  description: string;
  points: string[];
}> = [
  {
    id: "clipper",
    label: "Smart Clipper",
    eyebrow: "01 • SMART CLIPPER",
    title: "Tempel link, teks, atau poster lowongan.",
    shortDescription: "AI otomatis menata posisi, gaji, dan syarat utamanya.",
    description:
      "Salin link, teks, atau unggah poster/screenshot lowongan dari mana saja. AI otomatis menata posisi, rentang gaji, dan syarat utamanya.",
    points: [
      "Dukung link, teks, dan poster/screenshot loker",
      "Deteksi gaji & kualifikasi kunci otomatis",
      "Hingga 20 klip gratis setiap hari",
    ],
  },
  {
    id: "cvmatch",
    label: "Skor CV",
    eyebrow: "02 • SKOR CV",
    title: "Tahu kecocokan CV sebelum melamar.",
    shortDescription: "Unggah CV sekali, skor kecocokan muncul otomatis.",
    description:
      "Unggah CV sekali, lalu lihat skor relevansi otomatis di setiap lowongan yang kamu simpan.",
    points: [
      "Skor kecocokan muncul otomatis",
      "Soroti skill yang sudah sesuai & kurang",
      "Dokumen CV tersimpan aman secara privat",
    ],
  },
  {
    id: "archive",
    label: "Arsip JD",
    eyebrow: "03 • ARSIP JD",
    title: "Iklan ditutup, arsip JD tetap utuh.",
    shortDescription: "Deskripsi lowongan tersimpan permanen untuk interview.",
    description:
      "Deskripsi lowongan tersimpan permanen di ruang kerjamu, siap dibaca ulang saat persiapan interview.",
    points: [
      "Teks lengkap lowongan tidak pernah hilang",
      "Kualifikasi kunci otomatis ter-highlight",
      "Bisa dibuka cepat sebelum wawancara",
    ],
  },
  {
    id: "kanban",
    label: "5 Kolom Kanban",
    eyebrow: "04 • 5 KOLOM KANBAN",
    title: "5 kolom langsung, tanpa basa-basi.",
    shortDescription: "Geser lamaran dari Applied hingga Offered di satu papan.",
    description:
      "Geser kartu lamaran dari Applied, Follow-Up, Interview, Offered, hingga Ghosted dalam satu papan bersih.",
    points: [
      "Langsung fokus lamaran aktif (tanpa Wishlist)",
      "Drag-and-drop mulus di desktop & mobile",
      "Riwayat perpindahan status tercatat otomatis",
    ],
  },
  {
    id: "followup",
    label: "Follow-Up H+7",
    eyebrow: "05 • FOLLOW-UP H+7",
    title: "Follow-up tepat hari ke-7, tanpa lupa.",
    shortDescription: "Pengingat H+7 + draf pesan sopan ID & EN siap salin.",
    description:
      "Dapatkan pengingat otomatis di hari ke-7 beserta draf pesan sopan siap kirim dalam Bahasa Indonesia & Inggris.",
    points: [
      "Pengingat otomatis 7 hari setelah melamar",
      "Pilihan draf Bahasa Indonesia & Inggris",
      "Salin satu klik langsung ke email atau chat HR",
    ],
  },
];

function FeaturePreviewPanel({ activeId }: { activeId: FeatureId }) {
  const [followUpLang, setFollowUpLang] = useState<"id" | "en">("id");

  if (activeId === "clipper") {
    return (
      <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-3.5 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 p-1.5 pl-3">
          <span className="text-[11px] sm:text-xs text-slate-500 truncate flex-1">
            linkedin.com/jobs/frontend... atau poster.png
          </span>
          <span className="rounded-lg bg-[#0284C7] px-3 py-1.5 text-[11px] font-bold text-white shrink-0">
            Ekstrak AI
          </span>
        </div>

        <div className="hidden sm:flex justify-center">
          <span className="rounded-full bg-sky-100/90 px-3 py-0.5 text-[11px] font-semibold text-[#0284C7]">
            Otomatis terurai • Siap disimpan
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-sky-100 p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-9 w-9 rounded-full sm:rounded-xl bg-sky-100 text-[#0284C7] text-xs font-extrabold flex items-center justify-center shrink-0">
                TD
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">PT Telkom Digital</p>
                <p className="text-[11px] text-slate-500 truncate">Jakarta • Hybrid</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline-flex rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                Applied
              </span>
              <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0C4A6E]">
                Cocok CV: 88%
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
            <p className="text-sm sm:text-base font-extrabold text-slate-900">
              Senior Frontend Engineer
            </p>
            <span className="text-xs font-bold text-[#0284C7] shrink-0">Rp 18 - 24 jt / bln</span>
          </div>

          <div>
            <p className="hidden sm:block text-[10px] font-semibold text-slate-400 mb-1.5">
              Kualifikasi Kunci Terdeteksi
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Next.js &amp; React
              </span>
              <span className="hidden sm:inline-flex rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                TypeScript
              </span>
              <span className="hidden sm:inline-flex rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Tailwind CSS
              </span>
              <span className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-[11px] font-semibold text-[#0284C7]">
                Arsip JD Utuh ✓
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Follow-up otomatis H+7
            </span>
            <span className="rounded-full sm:rounded-lg bg-[#0284C7] px-3.5 py-1.5 text-[11px] font-bold text-white shrink-0">
              Simpan Lamaran
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (activeId === "cvmatch") {
    return (
      <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
        {/* Compact Horizontal on Mobile, Vertical Ring Card on Desktop */}
        <div className="sm:col-span-5 rounded-2xl bg-white border border-sky-100 p-3.5 sm:p-4 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 text-left sm:text-center">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24 flex items-center justify-center shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E0F2FE" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#0284C7"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="264"
                strokeDashoffset="32"
              />
            </svg>
            <span className="absolute text-base sm:text-2xl font-extrabold text-[#0284C7]">88%</span>
          </div>
          <div className="flex-1 sm:flex-initial space-y-1">
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
              CV_Ilham_2026.pdf
            </span>
            <div>
              <span className="inline-block rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-[#0C4A6E]">
                Kecocokan Tinggi
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400">Tersimpan aman • Privat</p>
          </div>
        </div>

        <div className="sm:col-span-7 rounded-2xl bg-white border border-sky-100 p-3.5 sm:p-4 space-y-2.5">
          <div>
            <p className="text-xs font-bold text-slate-900">Ringkasan Kesesuaian Skill</p>
            <p className="hidden sm:block text-[11px] text-slate-500">
              Senior Frontend Engineer • PT Telkom Digital
            </p>
          </div>
          {[
            { name: "Next.js & React", note: "96% • Cocok", pct: 96, tone: "sky", mobileShow: true },
            { name: "TypeScript", note: "92% • Cocok", pct: 92, tone: "sky", mobileShow: true },
            { name: "Tailwind CSS", note: "89% • Cocok", pct: 89, tone: "sky", mobileShow: true },
            { name: "GraphQL API", note: "Perlu disoroti", pct: 48, tone: "muted", mobileShow: false },
          ].map((row) => (
            <div key={row.name} className={cn("space-y-1", !row.mobileShow && "hidden sm:block")}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">{row.name}</span>
                <span className={row.tone === "sky" ? "text-[#0284C7] font-semibold" : "text-slate-400"}>
                  {row.note}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    row.tone === "sky" ? "bg-[#0284C7]" : "bg-slate-300"
                  )}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeId === "archive") {
    return (
      <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-4 sm:p-5 space-y-3">
        <div className="rounded-xl bg-white border border-sky-200 px-3.5 py-2 text-[11px] font-semibold text-[#0284C7] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#0284C7] shrink-0" />
          Link iklan asli sudah ditutup • Arsip JD permanenmu tetap utuh
        </div>

        <div className="rounded-2xl bg-white border border-sky-100 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Senior Frontend Engineer</p>
              <p className="text-[11px] text-slate-500">
                PT Telkom Digital • Jakarta (Hybrid) • Rp 18 - 24 jt / bln
              </p>
            </div>
            <span className="rounded-full bg-sky-50 border border-sky-100 px-2.5 py-1 text-[10px] font-semibold text-[#0284C7] shrink-0">
              Diarsipkan 14 Nov 2026
            </span>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 mb-1.5">
              Kualifikasi Kunci Terdeteksi
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0C4A6E]">
                Min. 3 thn Next.js
              </span>
              <span className="rounded-full bg-sky-50 border border-sky-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#0284C7]">
                TypeScript Kuat
              </span>
              <span className="rounded-full bg-sky-50 border border-sky-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#0284C7]">
                Design System UI
              </span>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-[11px] font-bold text-slate-800">Tanggung Jawab Utama (Arsip Asli):</p>
            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
              Merancang arsitektur antarmuka aplikasi web berkinerja tinggi menggunakan Next.js dan
              TypeScript, berkolaborasi erat dengan tim produk serta memastikan aksesibilitas
              antarmuka.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeId === "kanban") {
    const cols: Array<{
      title: string;
      color: string;
      cards: Array<{ co: string; role: string; badge?: string; lime?: boolean }>;
    }> = [
      {
        title: "Applied (4)",
        color: "text-blue-700",
        cards: [
          { co: "Gojek ID", role: "UI Engineer" },
          { co: "Traveloka", role: "Frontend Dev" },
        ],
      },
      {
        title: "Follow-Up (2)",
        color: "text-amber-700",
        cards: [{ co: "Telkom Digital", role: "Sr. Frontend", badge: "H+7 Hari Ini", lime: true }],
      },
      {
        title: "Interview (2)",
        color: "text-purple-700",
        cards: [{ co: "Tokopedia", role: "Web Engineer", badge: "User Round", lime: false }],
      },
      {
        title: "Offered (1)",
        color: "text-emerald-700",
        cards: [{ co: "Xendit ID", role: "Frontend Eng", badge: "Offering ✓", lime: false }],
      },
      {
        title: "Ghosted (1)",
        color: "text-rose-700",
        cards: [{ co: "Startup X", role: "14 hari lalu" }],
      },
    ];

    return (
      <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-3.5 overflow-x-auto">
        <div className="grid grid-cols-5 gap-2 min-w-[480px]">
          {cols.map((col) => (
            <div key={col.title} className="rounded-xl bg-white/90 border border-sky-100 p-2 space-y-2 min-h-[190px]">
              <p className={cn("text-[10px] font-bold truncate", col.color)}>{col.title}</p>
              {col.cards.map((c) => (
                <div key={c.co} className="rounded-lg bg-slate-50/90 border border-slate-100 p-2 space-y-1">
                  <p className="text-[10px] font-bold text-slate-900 truncate">{c.co}</p>
                  <p className="text-[9px] text-slate-500 truncate">{c.role}</p>
                  {c.badge ? (
                    <span
                      className={cn(
                        "inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        c.lime ? "bg-[#D4FF47] text-[#0C4A6E]" : "bg-sky-50 text-[#0284C7]"
                      )}
                    >
                      {c.badge}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // activeId === "followup"
  return (
    <div className="rounded-2xl bg-sky-50/75 border border-sky-100 p-4 sm:p-5 space-y-3">
      <div className="rounded-xl bg-white border border-sky-100 px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="rounded-lg bg-sky-100 px-2 py-1 text-[10px] font-extrabold text-[#0284C7]">
            H+7
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              Waktunya follow-up PT Telkom Digital
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              Senior Frontend Engineer • Dilamar 7 hari lalu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-bold text-xs text-[#0284C7]">
          <span className="rounded-md bg-sky-100 px-2 py-1">09</span>:
          <span className="rounded-md bg-sky-100 px-2 py-1">45</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-sky-100 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-900">Draf Pesan Siap Kirim</p>
          <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setFollowUpLang("id")}
              className={cn(
                "px-2.5 py-1 rounded-full transition cursor-pointer",
                followUpLang === "id" ? "bg-[#0284C7] text-white" : "text-slate-600"
              )}
            >
              Bahasa ID
            </button>
            <button
              type="button"
              onClick={() => setFollowUpLang("en")}
              className={cn(
                "px-2.5 py-1 rounded-full transition cursor-pointer",
                followUpLang === "en" ? "bg-[#0284C7] text-white" : "text-slate-600"
              )}
            >
              English EN
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-700 leading-relaxed">
          {followUpLang === "id"
            ? "Halo Kak Rina, saya Ilham yang melamar posisi Senior Frontend Engineer minggu lalu. Izin menanyakan perkembangan tahap seleksi untuk posisi tersebut. Terima kasih banyak atas waktunya!"
            : "Hi Rina, I am Ilham who applied for the Senior Frontend Engineer role last week. I wanted to kindly follow up on the status of my application. Thank you very much for your time!"}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400">
            Nada: Sopan &amp; Profesional • Siap tempel ke Email / WhatsApp
          </span>
          <span className="rounded-full bg-[#D4FF47] px-3.5 py-1.5 text-[11px] font-extrabold text-[#0C4A6E] shrink-0">
            Salin Draf Pesan
          </span>
        </div>
      </div>
    </div>
  );
}

export function FeaturesTabs() {
  ensureGsapRegistered();
  const [activeId, setActiveId] = useState<FeatureId>("clipper");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const active = FEATURE_TABS.find((t) => t.id === activeId) ?? FEATURE_TABS[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".feature-stage-anim",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power2.out", stagger: 0.05 }
        );
      });
    },
    { scope: panelRef, dependencies: [activeId] }
  );

  return (
    <div>
      {/* Pill Tabs — Both Sides Always Rounded + Smooth Horizontal Scroll Inside */}
      <div className="mt-7 flex justify-center">
        <div className="max-w-full rounded-full bg-white/95 border border-white p-1.5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="inline-flex flex-nowrap items-center gap-1">
            {FEATURE_TABS.map((tab) => {
              const isSelected = tab.id === active.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    "h-10 px-4 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                    isSelected
                      ? "bg-[#D4FF47] text-[#0C4A6E] shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* macOS-style Browser Window Card (EXACT FigCraft match) */}
      <div
        ref={panelRef}
        className="mt-8 rounded-[28px] bg-white/95 border border-white shadow-[0_20px_50px_-14px_rgba(2,132,199,0.16)] overflow-hidden"
      >
        {/* Window Top Chrome */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-sky-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-sky-200" />
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/80 px-3 py-1 text-[11px] font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-[#84CC16]" />
            18 / 20 Klip Hari Ini
          </span>
        </div>

        <div className="p-4 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          <div className="feature-stage-anim lg:col-span-5 space-y-2.5 sm:space-y-4">
            <span className="hidden lg:inline-block rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[11px] font-bold tracking-wide text-[#0284C7]">
              {active.eyebrow}
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {active.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <span className="lg:hidden">{active.shortDescription ?? active.description}</span>
              <span className="hidden lg:inline">{active.description}</span>
            </p>
            <ul className="hidden lg:block space-y-2.5 pt-1">
              {active.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="feature-stage-anim lg:col-span-7">
            <FeaturePreviewPanel activeId={active.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
