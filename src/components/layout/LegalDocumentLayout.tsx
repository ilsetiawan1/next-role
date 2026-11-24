import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { cn } from "@/lib/cn";

const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/security", label: "Security" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

interface LegalSection {
  title: string;
  body: string;
}

interface LegalDocumentLayoutProps {
  activePath: "/privacy" | "/terms" | "/security" | "/cookies";
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalDocumentLayout({
  activePath,
  title,
  updatedAt,
  intro,
  sections,
}: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-[#EEF6FF]">
      <div
        className="pt-5 pb-14 flex-1"
        style={{
          background:
            "linear-gradient(180deg, #0369A1 0%, #0284C7 26%, #38A9E8 52%, #BFE4FA 76%, #EEF6FF 94%, #EEF6FF 100%)",
        }}
      >
        <LandingNavbar />

        <main className="mx-auto max-w-5xl px-4 sm:px-6 mt-8 sm:mt-10">
          <div className="rounded-[28px] bg-white shadow-[0_24px_60px_-15px_rgba(2,132,199,0.2)] border border-white overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Sidebar with Soft Sky-Lime Wave Accent (EXACT FigCraft) */}
            <aside className="md:col-span-3 relative overflow-hidden bg-gradient-to-b from-[#EAF5FF] via-[#F2F9FF] to-[#EAF9E0] p-5 sm:p-6 flex flex-col justify-between">
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-900 px-3 mb-4">Terms &amp; Policies</p>
                <nav aria-label="Dokumen kebijakan" className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar">
                  {LEGAL_NAV.map((item) => {
                    const active = item.href === activePath;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-3.5 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition",
                          active
                            ? "bg-white text-[#0284C7] font-semibold shadow-xs"
                            : "text-slate-600 hover:bg-white/60 hover:text-slate-900 font-medium"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Decorative Soft Sky-Lime Bottom Wave */}
              <svg
                aria-hidden="true"
                viewBox="0 0 260 120"
                preserveAspectRatio="none"
                className="hidden md:block absolute inset-x-0 bottom-0 w-full h-32 pointer-events-none opacity-80"
              >
                <defs>
                  <linearGradient id="legalWave" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
                    <stop offset="65%" stopColor="#A3E635" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#D4FF47" stopOpacity="0.55" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 36 Q 70 10, 140 42 T 260 32 L 260 120 L 0 120 Z"
                  fill="url(#legalWave)"
                />
              </svg>
            </aside>

            {/* Right Legal Document Content */}
            <article className="md:col-span-9 bg-white p-6 sm:p-10 lg:p-12">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0284C7] tracking-tight">
                {title}
              </h1>
              <p className="mt-1 text-xs text-slate-400">Diperbarui {updatedAt}</p>
              <p className="mt-5 text-sm text-slate-600 leading-relaxed">{intro}</p>

              <div className="mt-7 divide-y divide-slate-100">
                {sections.map((section) => (
                  <section key={section.title} className="py-5 first:pt-2 last:pb-0">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
