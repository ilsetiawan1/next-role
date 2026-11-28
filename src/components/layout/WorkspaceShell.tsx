"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, Clock, Home, Plus, User, X } from "lucide-react";
import { ClipperModal } from "@/features/clipper";
import { formatRemainingDemoTime, getUserInitials } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/roles", label: "Roles", icon: Briefcase },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
] as const;

interface WorkspaceShellProps {
  user: {
    name: string | null;
    email: string;
    image?: string | null;
    isGuest: boolean;
  };
  initialQuotaUsed: number;
  quotaLimit: number;
  demoExpiresAt?: string | null;
  initialNowMs: number;
  children: ReactNode;
}

export function WorkspaceShell({
  user,
  initialQuotaUsed,
  quotaLimit,
  demoExpiresAt = null,
  initialNowMs,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const [clipperOpen, setClipperOpen] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(initialQuotaUsed);
  const [nowMs, setNowMs] = useState(initialNowMs);
  const [demoNoticeDismissed, setDemoNoticeDismissed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    function handleOpenClipper() {
      setClipperOpen(true);
    }
    window.addEventListener("nextrole:open-clipper", handleOpenClipper);
    return () => window.removeEventListener("nextrole:open-clipper", handleOpenClipper);
  }, []);

  useEffect(() => {
    if (!user.isGuest || !demoExpiresAt) return;
    const timer = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [user.isGuest, demoExpiresAt]);

  const demoRemaining = user.isGuest ? formatRemainingDemoTime(demoExpiresAt, nowMs) : null;

  const initials = getUserInitials(user.name, user.email);
  const isFlatSkyCanvas = pathname === "/home" || pathname.startsWith("/roles");

  return (
    <div
      className="min-h-dvh flex flex-col pb-28 md:pb-10"
      style={{
        background: isFlatSkyCanvas
          ? "#F4F9FF"
          : "linear-gradient(180deg, #F2F7FD 0%, #E6F0FA 100%)",
      }}
    >
      {/* Top Navbar: Clean minimal brand header on Mobile, Floating Pill Navbar on Tablet/Desktop */}
      <header className="sticky top-0 z-30 pt-3 md:pt-4 px-4 sm:px-6 lg:px-8 bg-[#F4F9FF]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
        <div className="mx-auto max-w-360 md:bg-white/95 md:backdrop-blur-xl md:border md:border-white md:shadow-[0_10px_28px_-6px_rgba(2,132,199,0.13)] md:rounded-full h-12 md:h-16 px-1 md:px-6 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/brand/android-chrome-192x192.png"
              alt="NextRole Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-base font-medium tracking-tight text-slate-900">nextrole</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/70 p-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition",
                    active
                      ? "bg-[#0284C7] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#D4FF47] px-3.5 py-1.5 text-xs font-medium text-[#0C4A6E]">
              {quotaUsed} / {quotaLimit} Klip
            </span>

            <button
              type="button"
              onClick={() => setClipperOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#0284C7] text-white text-xs font-medium hover:bg-[#0369A1] transition shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Catat Lamaran
            </button>

            <Link
              href="/profile"
              aria-label="Buka profil"
              className="h-10 w-10 rounded-full bg-sky-100 border border-white text-sky-800 text-xs font-medium flex items-center justify-center shadow-xs hover:bg-sky-200 transition overflow-hidden"
            >
              {user.image && !avatarFailed ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.image}
                  alt={user.name ?? "Foto profil"}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {children}
      </main>

      {/* Clean Floating Dismissible Demo Reminder Pill (zero layout shift; hidden on /profile where banner shows it) */}
      {user.isGuest && demoRemaining && !demoNoticeDismissed && pathname !== "/profile" ? (
        <div
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5.75rem)] right-4 md:bottom-5 md:right-6 z-30"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="bg-white/95 backdrop-blur-xl border border-sky-100/90 shadow-[0_10px_28px_-6px_rgba(2,132,199,0.2)] rounded-full pl-3.5 pr-1.5 py-1.5 flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-normal">
              <Clock className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
              <span>
                Demo · <span className="font-medium text-slate-900">{demoRemaining}</span>
              </span>
            </span>
            <Link
              href="/login"
              className="rounded-full bg-[#0284C7] text-white px-2.5 py-1 text-[11px] font-medium hover:bg-[#0369A1] transition"
            >
              Daftar
            </Link>
            <button
              type="button"
              onClick={() => setDemoNoticeDismissed(true)}
              aria-label="Tutup pengingat demo"
              className="h-6 w-6 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile Floating Bottom Pill Dock + Raised Center FAB (outer fixed wrapper separated from backdrop-filter for iOS WebKit/PWA stability) */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pointer-events-none"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
          transform: "translateZ(0)",
        }}
      >
        <nav
          aria-label="Navigasi mobile"
          className="pointer-events-auto glass-pill rounded-[28px] h-17 px-2 flex items-center justify-around"
        >
          {NAV_ITEMS.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-14 min-h-11 rounded-xl text-[11px] font-semibold transition",
                  active ? "text-[#0284C7]" : "text-slate-500"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setClipperOpen(true)}
            aria-label="Catat Lamaran Baru"
            className="-mt-7 h-14 w-14 rounded-full bg-[#0284C7] text-white shadow-lg shadow-sky-600/35 border-4 border-white flex items-center justify-center active:scale-95 transition cursor-pointer"
          >
            <Plus className="h-6 w-6" />
          </button>

          {NAV_ITEMS.slice(2).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-14 min-h-11 rounded-xl text-[11px] font-semibold transition",
                  active ? "text-[#0284C7]" : "text-slate-500"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <ClipperModal
        open={clipperOpen}
        onClose={() => setClipperOpen(false)}
        quotaUsed={quotaUsed}
        quotaLimit={quotaLimit}
        onQuotaChange={setQuotaUsed}
      />
    </div>
  );
}
