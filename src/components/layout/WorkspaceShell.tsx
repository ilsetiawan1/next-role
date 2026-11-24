"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, Home, Plus, User } from "lucide-react";
import { ClipperModal } from "@/features/clipper";
import { getUserInitials } from "@/features/shared/workspace-types";
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
    isGuest: boolean;
  };
  initialQuotaUsed: number;
  quotaLimit: number;
  children: ReactNode;
}

export function WorkspaceShell({
  user,
  initialQuotaUsed,
  quotaLimit,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const [clipperOpen, setClipperOpen] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(initialQuotaUsed);

  useEffect(() => {
    function handleOpenClipper() {
      setClipperOpen(true);
    }
    window.addEventListener("nextrole:open-clipper", handleOpenClipper);
    return () => window.removeEventListener("nextrole:open-clipper", handleOpenClipper);
  }, []);

  const initials = getUserInitials(user.name, user.email);

  return (
    <div className="min-h-dvh flex flex-col pb-24 md:pb-10">
      {/* Desktop & Tablet Top Floating Pill Navbar (sesuai FigCraft) */}
      <header className="sticky top-0 z-30 pt-4 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl glass-pill rounded-full h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/brand/logo.jpg"
              alt="NextRole Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-base font-bold tracking-tight text-slate-900">nextrole</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/70 p-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition",
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
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#D4FF47] px-3.5 py-1.5 text-xs font-bold text-[#0C4A6E]">
              {quotaUsed} / {quotaLimit} Klip
            </span>

            <button
              type="button"
              onClick={() => setClipperOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#0284C7] text-white text-xs font-semibold hover:bg-[#0369A1] transition shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Catat Lamaran
            </button>

            <Link
              href="/profile"
              aria-label="Buka profil"
              className="h-10 w-10 rounded-full bg-sky-100 border border-white text-sky-800 text-xs font-bold flex items-center justify-center shadow-xs hover:bg-sky-200 transition"
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-6">{children}</main>

      {/* Mobile Floating Bottom Pill Dock + Raised Center FAB */}
      <nav
        aria-label="Navigasi mobile"
        className="md:hidden fixed bottom-4 inset-x-4 z-40 glass-pill rounded-[28px] h-[68px] px-2 flex items-center justify-around"
      >
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl text-[11px] font-semibold transition",
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
                "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl text-[11px] font-semibold transition",
                active ? "text-[#0284C7]" : "text-slate-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>

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
