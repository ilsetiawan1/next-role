"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-40">
      <nav className="flex items-center justify-between rounded-full bg-white/15 backdrop-blur-xl border border-white/30 px-3.5 sm:px-6 py-2 lg:py-2.5 text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/brand/android-chrome-192x192.png"
            alt="NextRole Logo"
            width={34}
            height={34}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
          />
          <span className="text-base font-bold tracking-tight">nextrole</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/90">
          <a href="#top" className="hover:text-white transition">
            Home
          </a>
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition">
            How It Works
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-semibold text-white/95 hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full bg-[#D4FF47] text-[#0C4A6E] px-4 py-2 text-sm font-bold hover:brightness-95 transition shadow-sm"
          >
            Try Demo
          </Link>
        </div>

        {/* Mobile Circular Hamburger Button (EXACT FigCraft Mobile 390x844) */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={menuOpen}
          className="md:hidden h-10 w-10 rounded-full bg-white/20 border border-white/35 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {menuOpen ? (
        <div className="md:hidden mt-2.5 rounded-3xl bg-white/95 backdrop-blur-xl border border-white shadow-xl p-4 space-y-2 text-slate-900">
          {[
            { href: "#top", label: "Home" },
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How It Works" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="h-11 rounded-xl border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-800"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="h-11 rounded-xl bg-[#D4FF47] text-[#0C4A6E] flex items-center justify-center text-sm font-bold"
            >
              Try Demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
