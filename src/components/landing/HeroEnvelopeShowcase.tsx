"use client";

import { useRef } from "react";
import { Frown, Smile } from "lucide-react";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";

export function HeroEnvelopeShowcase() {
  ensureGsapRegistered();
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-copy-anim", {
          y: 18,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
        })
          .from(
            ".hero-pill-left",
            { x: -16, y: 8, opacity: 0, duration: 0.5 },
            "-=0.3"
          )
          .from(
            ".hero-pill-right",
            { x: 16, y: 8, opacity: 0, duration: 0.5 },
            "-=0.4"
          )
          .from(
            ".hero-card-left",
            { y: 34, rotation: 0, opacity: 0, duration: 0.65 },
            "-=0.3"
          )
          .from(
            ".hero-card-right",
            { y: 34, rotation: 0, opacity: 0, duration: 0.65 },
            "-=0.5"
          );
      });
    },
    { scope: scopeRef }
  );

  return (
    <div ref={scopeRef} className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 text-center">
      {/* Exact FigCraft weight: font-normal (400) airy headline */}
      <h1 className="hero-copy-anim text-[30px] sm:text-[46px] font-normal tracking-tight text-white leading-[1.18]">
        Satu ruang tenang untuk
        <br />
        kelola lamaranmu
      </h1>
      <p className="hero-copy-anim mx-auto mt-3.5 max-w-lg text-xs sm:text-[15px] font-normal text-sky-50/90 leading-relaxed px-2">
        Simpan arsip iklan lowongan secara permanen, cek kecocokan CV otomatis, dan pantau
        follow-up H+7 di satu papan kerja.
      </p>

      {/* FigCraft 3D Open Silver-Grey Envelope + 2-Col Pills */}
      <div className="mt-8 sm:mt-11 relative mx-auto max-w-87 sm:max-w-162.5">
        {/* Top Floating Comparison Pills — 2 Columns Side-by-Side */}
        <div className="grid grid-cols-2 gap-3 sm:gap-16 items-start relative z-30">
          <div className="hero-pill-left relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white px-3 py-2.5 sm:px-4 sm:py-2.5 shadow-lg shadow-sky-900/12 text-left">
            <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Frown className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Cara Manual</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                <span className="sm:hidden">JD tutup • Lupa</span>
                <span className="hidden sm:inline">JD hilang &amp; lupa H+7</span>
              </p>
            </div>
            {/* Dashed Connector Left — extends down into left card */}
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              fill="none"
              className="absolute -bottom-14 sm:-bottom-16 left-12 sm:left-24 w-14 sm:w-16 h-14 sm:h-16 text-white/90 pointer-events-none"
            >
              <path
                d="M 4 0 L 4 18 Q 4 26 12 26 L 48 26 Q 56 26 56 34 L 56 64"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="hero-pill-right relative flex items-center gap-2 sm:gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white px-3 py-2.5 sm:px-4 sm:py-2.5 shadow-lg shadow-sky-900/12 text-left mt-3 sm:mt-4">
            <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#0F2942] text-white flex items-center justify-center shrink-0">
              <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                <span className="sm:hidden">NextRole</span>
                <span className="hidden sm:inline">Dengan NextRole</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-sky-700 font-medium truncate">
                <span className="sm:hidden">Cocok CV: 88%</span>
                <span className="hidden sm:inline">Arsip utuh • Cocok 88%</span>
              </p>
            </div>
            {/* Dashed Connector Right — extends down into right card */}
            <svg
              aria-hidden="true"
              viewBox="0 0 64 56"
              fill="none"
              className="absolute -bottom-12 sm:-bottom-14 right-12 sm:right-28 w-14 sm:w-16 h-12 sm:h-14 text-white/90 pointer-events-none"
            >
              <path
                d="M 56 0 L 56 14 Q 56 22 48 22 L 14 22 Q 6 22 6 30 L 6 56"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        </div>

        {/* Open 3D Silver-Grey Envelope Assembly (True V-Peak Back Flap Connecting Front Corners) */}
        <div className="relative mx-auto mt-4 sm:mt-5 max-w-82.5 sm:max-w-145 pt-6 sm:pt-8">
          {/* Envelope Back Flap — Real Triangular Open Envelope Peak Above Cards */}
          <svg
            aria-hidden="true"
            viewBox="0 0 600 280"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          >
            <path
              d="M 10 132 L 274 14 Q 300 2 326 14 L 590 132 L 590 278 L 10 278 Z"
              fill="#CFDCE9"
              stroke="#DCE5F0"
              strokeWidth="1.5"
            />
          </svg>

          {/* 2 Tall Fanned Cards Sitting Inside Real Open Envelope */}
          <div className="relative z-10 grid grid-cols-2 gap-1 sm:gap-2 px-5 sm:px-9 pb-14 sm:pb-20">
            {/* Left Card: Spreadsheet Manual */}
            <div className="hero-card-left rotate-[3deg] translate-y-2 min-h-[118px] sm:min-h-[148px] rounded-2xl bg-white/95 border border-slate-200/80 p-3 sm:p-5 text-left shadow-md">
              <p className="text-[11px] font-medium text-slate-400 truncate">
                <span className="sm:hidden">Spreadsheet</span>
                <span className="hidden sm:inline">Spreadsheet Manual</span>
              </p>
              <p className="mt-1 text-xs sm:text-base font-bold text-slate-700 leading-snug">
                <span className="sm:hidden">14 data tercecer</span>
                <span className="hidden sm:inline">14 lamaran tercecer</span>
              </p>
              <span className="hidden sm:inline-block mt-3 rounded-lg bg-slate-100/90 px-3 py-1 text-[11px] font-medium text-slate-500">
                Iklan lowongan ditutup
              </span>
            </div>

            {/* Right Card: NextRole Highlight */}
            <div className="hero-card-right -rotate-[2deg] min-h-[126px] sm:min-h-[154px] rounded-2xl bg-white border border-sky-200/90 p-3 sm:p-5 text-left shadow-lg shadow-slate-900/8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <span className="text-[11px] sm:text-xs font-medium text-slate-600 whitespace-nowrap">
                  PT Telkom Digital
                </span>
                <span className="w-fit rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0C4A6E] shrink-0">
                  Cocok 88%
                </span>
              </div>
              <p className="mt-2 sm:mt-2.5 text-xs sm:text-[15px] font-bold text-slate-900 leading-snug">
                <span className="sm:hidden">Frontend Eng.</span>
                <span className="hidden sm:inline">Senior Frontend Engineer</span>
              </p>
              <span className="hidden sm:inline-block mt-2.5 rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[11px] font-semibold text-[#0284C7]">
                Arsip JD Utuh
              </span>
            </div>
          </div>

          {/* Envelope Front Pocket — Exact Corner Alignment with Back Flap */}
          <svg
            aria-hidden="true"
            viewBox="0 0 600 160"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 w-full h-[104px] sm:h-[144px] z-20 pointer-events-none"
          >
            <defs>
              <linearGradient id="envFrontGrey" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DCE4EE" />
                <stop offset="100%" stopColor="#E6EEF7" />
              </linearGradient>
              <linearGradient id="envBottomGrey" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4ECF5" />
                <stop offset="100%" stopColor="#ECF3FA" />
              </linearGradient>
            </defs>
            <path
              d="M 10 8 L 300 108 L 590 8 L 590 146 Q 590 158 578 158 L 22 158 Q 10 158 10 146 Z"
              fill="url(#envFrontGrey)"
              stroke="#C9D5E3"
              strokeWidth="1.5"
            />
            <path
              d="M 14 157 L 284 96 Q 300 92 316 96 L 586 157 Z"
              fill="url(#envBottomGrey)"
              stroke="#D2DCE8"
              strokeWidth="1.2"
            />
          </svg>

          {/* Soft Bottom Mist Fade covering lower edge of envelope on Desktop/Tablet */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute -inset-x-8 -bottom-4 h-18 z-30 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(238,246,255,0) 0%, rgba(238,246,255,0.78) 58%, #EEF6FF 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
