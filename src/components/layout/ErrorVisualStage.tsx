"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";

interface ErrorVisualStageProps {
  code: "404" | "500";
  headline: string;
  subtitle: string;
  headerActionLabel: string;
  headerActionHref: string;
  onRetry?: () => void;
}

export function ErrorVisualStage({
  code,
  headline,
  subtitle,
  headerActionLabel,
  headerActionHref,
  onRetry,
}: ErrorVisualStageProps) {
  ensureGsapRegistered();
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".err-header", { y: -14, opacity: 0, duration: 0.45 })
          .from(".err-numeral", { scale: 0.9, opacity: 0, duration: 0.65 }, "-=0.25")
          .from(".err-mascot", { y: 34, opacity: 0, duration: 0.7 }, "-=0.45")
          .from(".err-copy", { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.35");

        // Continuous floating & gentle tilt on the 3D mascot
        gsap.to(".err-mascot-img", {
          y: -12,
          rotation: 1.6,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6,
        });

        // Subtle breathing scale on the giant background numeral
        gsap.to(".err-numeral", {
          scale: 1.025,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.7,
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <main
      ref={rootRef}
      className="relative min-h-dvh flex flex-col justify-between overflow-hidden bg-[#EBF3FD]"
    >
      <Image
        src="/images/landing/hero-sky-clouds.jpg"
        alt="Latar langit awan biru"
        fill
        priority
        className="object-cover object-center pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(91,164,230,0.82) 0%, rgba(124,187,238,0.58) 24%, rgba(183,217,248,0.22) 52%, rgba(235,243,253,0.92) 74%, #EBF3FD 88%)",
        }}
      />

      <header className="err-header relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-12 pt-7 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <Image
            src="/images/brand/android-chrome-192x192.png"
            alt="NextRole Logo"
            width={34}
            height={34}
            className="h-8 w-8 rounded-full object-cover shadow-xs"
          />
          <span className="text-lg font-bold tracking-tight">nextrole</span>
        </Link>

        <Link
          href={headerActionHref}
          className="h-10 px-5 rounded-xl bg-white text-slate-900 text-sm font-semibold shadow-sm hover:bg-slate-50 transition inline-flex items-center"
        >
          {headerActionLabel}
        </Link>
      </header>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="relative flex items-center justify-center w-full max-w-4xl">
          <span
            aria-hidden="true"
            className="err-numeral select-none font-extrabold text-white/95 tracking-widest leading-none text-[140px] sm:text-[260px] lg:text-[380px]"
          >
            {code}
          </span>

          <div className="err-mascot absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Image
              src="/images/error/mascot-404.png"
              alt="Maskot 3D NextRole kebingungan"
              width={395}
              height={466}
              priority
              className="err-mascot-img w-44 sm:w-64 lg:w-80 h-auto object-contain drop-shadow-[0_24px_24px_rgba(15,23,42,0.18)] will-change-transform"
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 max-w-xl">
          <h1 className="err-copy text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {headline}
          </h1>
          <p className="err-copy mt-2.5 text-sm sm:text-base text-slate-500">{subtitle}</p>

          <div className="err-copy mt-7">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-white text-slate-900 border border-slate-200 text-sm font-semibold shadow-sm hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
                Muat Ulang Halaman
              </button>
            ) : (
              <Link
                href="/home"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-white text-slate-900 border border-slate-200 text-sm font-semibold shadow-sm hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Home
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="h-6" />
    </main>
  );
}
