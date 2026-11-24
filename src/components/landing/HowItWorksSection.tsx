"use client";

import { useRef } from "react";
import Image from "next/image";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";

const HOW_STEPS = [
  {
    title: "Mulai Sekali, Tanpa Ribet",
    desc: "Unggah CV PDF ke penyimpanan privatmu, atau langsung jelajahi lewat Mode Demo 1-klik tanpa daftar.",
    image: "/images/landing/how-upload.png",
    tiltClass: "-rotate-1 md:-rotate-2",
  },
  {
    title: "Pantau & Siapkan Interview",
    desc: "Geser status lamaran antar 5 tahap aktif dan baca kembali arsip JD kapan pun undangan interview masuk.",
    image: "/images/landing/how-track.png",
    tiltClass: "rotate-1 md:rotate-0",
  },
  {
    title: "Tindak Lanjut Tepat Waktu",
    desc: "Terima pengingat otomatis H+7 lengkap dengan draf pesan sopan (ID & EN) agar lamaranmu tidak tenggelam.",
    image: "/images/landing/how-followup.png",
    tiltClass: "-rotate-1 md:rotate-2",
  },
];

export function HowItWorksSection() {
  ensureGsapRegistered();
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".how-card-anim", {
          y: 32,
          opacity: 0,
          duration: 0.65,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-14 sm:py-16"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How It Works
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Tiga langkah tenang untuk kelola seluruh lamaranmu
        </p>
      </div>

      {/* Tilted Landscape Cards + Transparent 3D Icons + Desktop & Mobile Curved Arrows */}
      <div className="relative mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-7 items-center px-3 md:px-0">
        {/* Desktop Top Curved Arrow (Card 1 -> Card 2) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 124 56"
          fill="none"
          className="hidden md:block absolute -top-12 left-[28.5%] w-28 h-14 text-[#0284C7] pointer-events-none"
        >
          <path
            d="M 10 44 Q 56 4 108 30"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 99 16 L 111 31 L 92 34"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Desktop Bottom Curved Arrow (Card 2 -> Card 3) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 124 56"
          fill="none"
          className="hidden md:block absolute -bottom-12 left-[61.5%] w-28 h-14 text-[#0284C7] pointer-events-none"
        >
          <path
            d="M 10 12 Q 56 52 108 26"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 92 22 L 111 25 L 99 40"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Mobile Right-Side Curved Arrow (Card 1 -> Card 2, EXACT FigCraft Mobile) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 48 160"
          fill="none"
          className="md:hidden absolute right-0 top-[21%] w-10 h-36 text-[#0284C7] pointer-events-none z-20"
        >
          <path
            d="M 12 10 C 42 36, 42 118, 12 146"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 12 132 L 10 148 L 26 144"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Mobile Left-Side Curved Arrow (Card 2 -> Card 3, EXACT FigCraft Mobile) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 48 160"
          fill="none"
          className="md:hidden absolute left-0 top-[56%] w-10 h-36 text-[#0284C7] pointer-events-none z-20"
        >
          <path
            d="M 36 10 C 6 36, 6 118, 36 146"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 22 144 L 38 148 L 36 132"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {HOW_STEPS.map((step) => (
          <div
            key={step.title}
            className={`how-card-anim relative glass-surface rounded-[24px] p-5 sm:p-6 pt-6 sm:pt-7 mx-3 md:mx-0 transition-transform duration-300 hover:-translate-y-1 ${step.tiltClass}`}
          >
            {/* Transparent Floating 3D Isometric Icon (NO background box) */}
            <Image
              src={step.image}
              alt={step.title}
              width={112}
              height={112}
              className="absolute -top-8 sm:-top-9 right-2 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none drop-shadow-[0_12px_18px_rgba(2,132,199,0.22)]"
            />

            <div className="h-1 w-8 rounded-full bg-[#D4FF47] mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-20 leading-snug">
              {step.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
