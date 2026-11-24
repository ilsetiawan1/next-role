import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="mt-auto bg-[#EEF6FF] border-t border-sky-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-7 space-y-5">
        {/* Row 1: Brand + Primary Nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/brand/logo.jpg"
              alt="NextRole Logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="font-bold text-slate-900 text-sm">nextrole</span>
            <span>• Asisten pencarian kerja cerdas</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-600 font-medium">
            <Link href="/#top" className="hover:text-slate-900 transition">
              Home
            </Link>
            <Link href="/#features" className="hover:text-slate-900 transition">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 transition">
              How It Works
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition">
              Try Demo
            </Link>
          </div>
        </div>

        {/* Row 2: Copyright + 4 Legal Links (EXACT FigCraft Footer) */}
        <div className="pt-4 border-t border-sky-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 NextRole. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/privacy" className="hover:text-slate-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-slate-900 transition">
              Security
            </Link>
            <Link href="/cookies" className="hover:text-slate-900 transition">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
