import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturesTabs } from "@/components/landing/FeaturesTabs";
import { HeroEnvelopeShowcase } from "@/components/landing/HeroEnvelopeShowcase";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#EEF6FF]">
      {/* Hero Section dengan gradasi sky-blue murni persis desain FigCraft */}
      <section
        className="relative overflow-hidden pb-10 sm:pb-12 pt-5"
        style={{
          background:
            "linear-gradient(180deg, #0369A1 0%, #0284C7 34%, #2CA4E6 60%, #9AD5F7 78%, #EEF6FF 94%, #EEF6FF 100%)",
        }}
      >

        {/* Floating Top Navbar (Desktop Links + Mobile Circular Hamburger Menu) */}
        <LandingNavbar />

        {/* Hero Copy + Interactive Envelope Showcase (GSAP) */}
        <div id="top">
          <HeroEnvelopeShowcase />
        </div>
      </section>

      {/* Features Showcase (macOS Browser Mockup + 5 Live Interactive States) */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Features
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Lihat langsung cara NextRole merapikan setiap tahap lamaranmu
          </p>
        </div>

        <FeaturesTabs />
      </section>

      {/* How It Works (Tilted Cards + Corner 3D Icons + Curved Arrows + ScrollTrigger) */}
      <HowItWorksSection />

      {/* Bottom CTA Banner — Ocean-Sky Gradient + Soft Luminous Orbs persis FigCraft */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
        <div
          className="rounded-4xl px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl shadow-sky-700/15 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0B5E98 0%, #0E86C7 52%, #19B4E3 100%)",
          }}
        >
          {/* Decorative Soft Sky Orbs persis FigCraft */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-sky-300/25 blur-xs"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -bottom-20 h-60 w-60 rounded-full bg-cyan-200/30 blur-xs"
          />

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            Mulai kelola lamaranmu dengan lebih
            <br className="hidden sm:inline" /> tenang
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-sky-100 relative z-10">
            Arsipkan JD permanen, cek skor kecocokan CV otomatis, dan jangan lewatkan follow-up H+7
            lagi.
          </p>
          <div className="mt-7 relative z-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-6 py-3.5 text-sm font-bold hover:brightness-95 transition shadow-sm"
            >
              Coba Mode Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
