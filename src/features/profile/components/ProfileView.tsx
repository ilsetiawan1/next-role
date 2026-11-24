"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  LogOut,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  downloadApplicationsCsv,
  formatRemainingDemoTime,
  formatShortDateId,
  getUserInitials,
  type ApplicationDto,
  type ProfileDto,
} from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { animateCountUp, ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { deleteCvApi, getCvPreviewUrlApi } from "../api/profileApi";
import { CvProfileModal } from "./CvProfileModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

interface ProfileViewProps {
  initialProfile: ProfileDto;
  isGuest: boolean;
  initialNowMs: number;
  applications: ApplicationDto[];
  stats: {
    totalApplied: number;
    interviews: number;
    offers: number;
    responseRate: number;
  };
}

export function ProfileView({
  initialProfile,
  isGuest,
  initialNowMs,
  applications,
  stats,
}: ProfileViewProps) {
  ensureGsapRegistered();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [profile, setProfile] = useState<ProfileDto>(initialProfile);
  const [nowMs, setNowMs] = useState(initialNowMs);
  const [followUpReminderOn, setFollowUpReminderOn] = useState(true);
  const [draftLang, setDraftLang] = useState<"ID" | "EN">("ID");
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const isStandalone = useSyncExternalStore(subscribeStandalone, getIsStandalone, () => false);

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setPwaInstalled(true);
      setDeferredInstallPrompt(null);
      setMessage({ type: "ok", text: "NextRole berhasil dipasang ke layar utama perangkatmu." });
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstallPwa() {
    if (deferredInstallPrompt) {
      await deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setPwaInstalled(true);
      }
      setDeferredInstallPrompt(null);
      return;
    }
    setMessage({
      type: "ok",
      text: "Buka menu browser (ikon Share di Safari iOS atau menu ⋮ di Chrome) lalu pilih 'Tambahkan ke Layar Utama'.",
    });
  }

  useEffect(() => {
    if (!isGuest || !profile.demoExpiresAt) return;
    const timer = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [isGuest, profile.demoExpiresAt]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".profile-stagger-card", {
          y: 16,
          opacity: 0,
          duration: 0.45,
          stagger: 0.055,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });

        const statNodes = profileRef.current?.querySelectorAll<HTMLElement>("[data-profile-stat]");
        statNodes?.forEach((node) => {
          const target = Number(node.dataset.target ?? "0");
          const suffix = node.dataset.suffix ?? "";
          animateCountUp(node, target, { suffix, duration: 0.85 });
        });

        gsap.to(".profile-promo-art", {
          y: -6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: profileRef }
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".profile-toggle-knob",
          { scale: 0.82 },
          { scale: 1, duration: 0.22, ease: "back.out(2)" }
        );
      });
    },
    { scope: profileRef, dependencies: [followUpReminderOn] }
  );

  const demoRemaining = isGuest ? formatRemainingDemoTime(profile.demoExpiresAt, nowMs) : null;
  const initials = getUserInitials(profile.name, profile.email);

  async function handleOpenPreview() {
    setMessage(null);
    setLoadingPreview(true);
    try {
      const res = await getCvPreviewUrlApi();
      setPreviewUrl(res.url);
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal membuka pratinjau PDF.",
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleDeleteCv() {
    setMessage(null);
    setDeleting(true);
    try {
      await deleteCvApi();
      setProfile((prev) => ({
        ...prev,
        cv: { fileName: null, updatedAt: null, hasCv: false },
      }));
      setMessage({ type: "ok", text: "CV PDF berhasil dihapus secara permanen dari akunmu." });
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal menghapus CV.",
      });
    } finally {
      setDeleting(false);
    }
  }

  const heroProfileCard = (
    <div className="profile-stagger-card glass-surface rounded-[28px] p-3 pb-5 sm:pb-6">
      {/* Inset Rounded Soft Sky Banner with Glossy Circles (persis FigCraft!) */}
      <div
        className="h-24 sm:h-28 rounded-[20px] relative overflow-hidden px-3.5 sm:px-4 pt-3 flex items-start justify-between gap-2"
        style={{
          background: "linear-gradient(135deg, #93C5FD 0%, #38BDF8 48%, #0284C7 100%)",
        }}
      >
        {/* Subtle Glossy Translucent Circles */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 -top-6 h-36 w-36 rounded-full bg-white/25"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/15"
        />

        {isGuest && demoRemaining ? (
          <>
            <span className="relative z-10 inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-md border border-white/35 px-2.5 py-1 text-[11px] font-medium text-white whitespace-nowrap">
              <Clock className="h-3 w-3 shrink-0" />
              Demo · {demoRemaining}
            </span>
            <Link
              href="/login"
              className="relative z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#0284C7] hover:bg-white transition whitespace-nowrap shrink-0"
            >
              Simpan Permanen
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </>
        ) : null}
      </div>

      {/* Avatar overlapping banner bottom-left; Name & Email cleanly on white surface beside it */}
      <div className="px-2 sm:px-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="-mt-9 sm:-mt-10 relative z-10 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-sky-100 border-4 border-white text-sky-800 text-lg sm:text-xl font-medium flex items-center justify-center shadow-md shrink-0 overflow-hidden">
            {profile.image && !avatarFailed ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.image}
                alt={profile.name ?? "Foto profil"}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="pt-2 min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-slate-900 truncate">
              {profile.name ?? "Pengguna NextRole"}
            </h2>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] sm:text-xs font-normal text-slate-500 max-w-full">
              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{profile.email}</span>
            </p>
          </div>
        </div>

        <span className="mt-2.5 hidden sm:inline-flex rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[11px] font-normal text-[#0284C7] shrink-0">
          {isGuest ? "Mode Demo" : "Terverifikasi"}
        </span>
      </div>

      {/* 4-Column Stats Row */}
      <div className="mt-5 mx-2 sm:mx-3 grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 text-center">
        <div>
          <p
            data-profile-stat
            data-target={stats.totalApplied}
            className="text-lg sm:text-xl font-medium text-slate-900"
          >
            {stats.totalApplied}
          </p>
          <p className="text-[11px] font-normal text-slate-500">Total Lamaran</p>
        </div>
        <div>
          <p
            data-profile-stat
            data-target={stats.interviews}
            className="text-lg sm:text-xl font-medium text-[#0284C7]"
          >
            {stats.interviews}
          </p>
          <p className="text-[11px] font-normal text-slate-500">Wawancara</p>
        </div>
        <div>
          <p
            data-profile-stat
            data-target={stats.offers}
            className="text-lg sm:text-xl font-medium text-emerald-600"
          >
            {stats.offers}
          </p>
          <p className="text-[11px] font-normal text-slate-500">Penawaran</p>
        </div>
        <div>
          <p
            data-profile-stat
            data-target={stats.responseRate}
            data-suffix="%"
            className="text-lg sm:text-xl font-medium text-slate-900"
          >
            {stats.responseRate}%
          </p>
          <p className="text-[11px] font-normal text-slate-500">Tingkat Respon</p>
        </div>
      </div>
    </div>
  );

  const promoBannerCard = (
    <div
      className="profile-stagger-card rounded-[28px] p-5 sm:p-6 pb-8 text-white flex items-center justify-between gap-4 shadow-lg shadow-sky-700/15 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B6AA8 0%, #0E86C7 55%, #1DB3E2 100%)",
      }}
    >
      <div className="max-w-sm relative z-10">
        <h3 className="text-base sm:text-lg font-medium leading-snug">
          Arsip Kerja Siap Saat HRD Menelepon
        </h3>
        <p className="mt-1.5 text-xs font-normal text-sky-100 leading-relaxed">
          Buka kartu lamaran kapan saja untuk baca deskripsi &amp; gaji tanpa cari ulang link.
        </p>
        <Link
          href="/roles"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-4 py-2 text-xs font-medium hover:brightness-95 transition"
        >
          Buka Papan Roles
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <Image
        src="/images/dashboard/banner-clipper-1.png"
        alt="Ilustrasi Arsip JD"
        width={136}
        height={118}
        className="profile-promo-art hidden sm:block w-28 lg:w-32 h-auto object-contain shrink-0 drop-shadow-md will-change-transform"
      />
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-xs">
        <span className="h-1.5 w-3.5 rounded-full bg-[#0284C7]" />
        <span className="h-1.5 w-1.5 rounded-full bg-sky-200" />
        <span className="h-1.5 w-1.5 rounded-full bg-sky-200" />
      </div>
    </div>
  );

  const accountGroup = (includeInlineCv: boolean) => (
    <div className="profile-stagger-card space-y-2">
      <p className="text-xs font-normal text-slate-500 px-1">Account</p>
      <div className="glass-surface rounded-3xl divide-y divide-slate-100">
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">Kuota Smart AI Clipper</p>
          </div>
          <span className="rounded-full bg-[#D4FF47] px-3 py-1 text-xs font-medium text-[#0C4A6E] shrink-0">
            {profile.quota.used} / {profile.quota.limit} Klip
          </span>
        </div>

        {includeInlineCv ? (
          <button
            type="button"
            onClick={() => setCvModalOpen(true)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-sky-50/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-normal text-slate-900 truncate">
                  Profil CV &amp; Skill (PDF)
                </p>
                {profile.cv.hasCv ? (
                  <p className="text-[11px] text-slate-400 truncate">{profile.cv.fileName}</p>
                ) : null}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] shrink-0">
              {profile.cv.hasCv ? "Kelola · Preview" : "Unggah PDF"}
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </span>
          </button>
        ) : null}

        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">
              Akun &amp; Penyimpanan Privat
            </p>
          </div>
          <span className="text-xs font-normal text-[#0284C7] shrink-0">Terenkripsi &amp; Privat</span>
        </div>
      </div>
    </div>
  );

  const preferencesGroup = (
    <div className="profile-stagger-card space-y-2">
      <p className="text-xs font-normal text-slate-500 px-1">Preferences</p>
      <div className="glass-surface rounded-3xl divide-y divide-slate-100">
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">
              Pengingat Follow-Up Otomatis (H+7)
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={followUpReminderOn}
            onClick={() => setFollowUpReminderOn((v) => !v)}
            className={cn(
              "h-6 w-11 rounded-full transition-colors p-0.5 flex items-center shrink-0 cursor-pointer",
              followUpReminderOn ? "bg-[#0284C7] justify-end" : "bg-slate-200 justify-start"
            )}
          >
            <span className="profile-toggle-knob h-5 w-5 rounded-full bg-white shadow-xs block" />
          </button>
        </div>

        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Globe className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">
              Bahasa Default Draf Pesan HRD
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDraftLang((l) => (l === "ID" ? "EN" : "ID"))}
            className="inline-flex items-center gap-1 text-xs font-normal text-slate-600 hover:text-[#0284C7] transition cursor-pointer shrink-0"
          >
            {draftLang === "ID" ? "Indonesia · EN" : "English · ID"}
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const dataPrivacyGroup = (
    <div className="profile-stagger-card space-y-2">
      <p className="text-xs font-normal text-slate-500 px-1">Data &amp; Privacy</p>
      <div className="glass-surface rounded-3xl divide-y divide-slate-100">
        <button
          type="button"
          onClick={() => downloadApplicationsCsv(applications, "nextrole-riwayat-lamaran.csv")}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-sky-50/40 transition cursor-pointer rounded-t-3xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Download className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">
              Ekspor Riwayat Lamaran &amp; Arsip JD
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-normal text-[#0284C7] shrink-0">
            Unduh CSV
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </span>
        </button>

        <Link
          href="/privacy"
          className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-sky-50/40 transition rounded-b-3xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">Kebijakan Privasi Data</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        </Link>
      </div>
    </div>
  );

  const sessionGroup = (
    <div className="profile-stagger-card space-y-2">
      <p className="text-xs font-normal text-slate-500 px-1">Session</p>
      <div className="glass-surface rounded-3xl divide-y divide-slate-100">
        {!isStandalone && !pwaInstalled ? (
          <button
            type="button"
            onClick={handleInstallPwa}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-sky-50/40 transition cursor-pointer rounded-t-3xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                <Smartphone className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-normal text-slate-900 truncate">
                  Pasang Aplikasi NextRole
                </p>
                <p className="text-[11px] font-normal text-slate-400 truncate">
                  Tambahkan ke layar utama untuk akses cepat
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] shrink-0">
              Pasang
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </span>
          </button>
        ) : null}

        <Link
          href="/#cara-kerja"
          className={cn(
            "w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-sky-50/40 transition",
            (isStandalone || pwaInstalled) && "rounded-t-3xl"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-slate-900 truncate">Panduan Penggunaan NextRole</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-rose-50/50 transition cursor-pointer rounded-b-3xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <LogOut className="h-4 w-4" />
            </span>
            <p className="text-sm font-normal text-rose-600 truncate">Keluar Akun</p>
          </div>
          <ChevronRight className="h-4 w-4 text-rose-400 shrink-0" />
        </button>
      </div>
    </div>
  );

  const fullCvCard = (
    <div className="profile-stagger-card space-y-2">
      <p className="text-xs font-normal text-slate-500 px-1">Profil CV &amp; Skill (PDF)</p>
      <div className="glass-surface rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="h-11 w-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {profile.cv.hasCv ? profile.cv.fileName : "Belum ada CV PDF terunggah"}
            </p>
            <p className="text-xs font-normal text-slate-500 truncate mt-0.5">
              {profile.cv.hasCv
                ? `Tersimpan privat · Pencocokan CV aktif · Diperbarui ${
                    profile.cv.updatedAt ? formatShortDateId(profile.cv.updatedAt) : "-"
                  }`
                : "Unggah PDF (maks 5 MB) untuk mengaktifkan skor kecocokan CV otomatis."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {profile.cv.hasCv ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenPreview}
                disabled={loadingPreview}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {loadingPreview ? "Membuka..." : "Preview PDF"}
              </Button>
              <Button size="sm" onClick={() => setCvModalOpen(true)}>
                <Upload className="h-3.5 w-3.5" />
                Ubah CV
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteCv} disabled={deleting}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setCvModalOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Unggah CV PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={profileRef} className="space-y-5">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-xl sm:text-[26px] font-normal text-slate-900 tracking-tight">
          Profile
        </h1>
        <p className="hidden md:block text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
          Kelola akun, kuota harian AI clipper, preferensi pipeline, dan data lamaran
        </p>
      </div>

      {message ? (
        <div
          role={message.type === "err" ? "alert" : "status"}
          className={
            message.type === "ok"
              ? "rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800"
              : "rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700"
          }
        >
          {message.text}
        </div>
      ) : null}

      {/* MOBILE LAYOUT (< md): Exact FigCraft Profile Mobile 390x844 */}
      <div className="md:hidden space-y-4">
        {heroProfileCard}
        {accountGroup(true)}
        {preferencesGroup}
        {dataPrivacyGroup}
        {sessionGroup}
      </div>

      {/* TABLET LAYOUT (md..xl): Exact FigCraft Profile Tablet 834x1194 */}
      <div className="hidden md:block xl:hidden space-y-5">
        {heroProfileCard}
        <div className="grid grid-cols-2 gap-4 items-start">
          {accountGroup(false)}
          {preferencesGroup}
          {dataPrivacyGroup}
          {sessionGroup}
        </div>
        {fullCvCard}
        {promoBannerCard}
      </div>

      {/* DESKTOP LAYOUT (xl+): EXACT FigCraft Profile Desktop 1440x900 (2-Column Split!) */}
      <div className="hidden xl:grid xl:grid-cols-12 gap-6 items-start">
        <div className="col-span-6 space-y-5">
          {heroProfileCard}
          {promoBannerCard}
        </div>
        <div className="col-span-6 space-y-4">
          {accountGroup(true)}
          {preferencesGroup}
          {dataPrivacyGroup}
          {sessionGroup}
        </div>
      </div>

      {/* Modal Kelola & Upload CV PDF (persis FigCraft Modal Kelola CV) */}
      <CvProfileModal
        open={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated, notice) => {
          setProfile(updated);
          setMessage({ type: "ok", text: notice });
        }}
        onOpenPreview={handleOpenPreview}
        loadingPreview={loadingPreview}
      />

      {/* Modal Pratinjau PDF Sementara (5 Menit) */}
      <Modal
        open={previewUrl !== null}
        onClose={() => setPreviewUrl(null)}
        title={profile.cv.fileName ?? "Pratinjau CV PDF"}
        subtitle="Tautan pratinjau sementara ini otomatis kedaluwarsa dalam 5 menit demi privasimu."
        maxWidthClass="max-w-4xl"
      >
        {previewUrl ? (
          <div className="space-y-3">
            <iframe
              src={previewUrl}
              title="Pratinjau CV PDF"
              className="w-full h-[65dvh] rounded-2xl border border-slate-200 bg-slate-50"
            />
            <div className="flex justify-end">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0284C7] hover:underline"
              >
                Buka di Tab Baru
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
