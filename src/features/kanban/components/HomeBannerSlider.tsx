"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";

const SLIDES = [
  {
    id: "clipper",
    mobileTitle: "Kuasai Wawancara AI",
    tabletTitle: "Kuasai Wawancara dengan Ringkasan AI",
    desktopTitle: "Kuasai Wawancara AI dengan Ringkasan Otomatis",
    mobileSubtitle: "Draf follow-up & arsip loker permanen.",
    tabletSubtitle: "Ekstrak syarat loker & draf follow-up H+7 otomatis.",
    desktopSubtitle: "Ekstrak kualifikasi, simpan arsip JD permanen, dan buat draf follow-up H+7 otomatis.",
    ctaLabel: "Coba Sekarang",
    action: "clipper" as const,
    image: "/images/dashboard/banner-clipper-1.png",
  },
  {
    id: "archive",
    mobileTitle: "Arsip JD Permanen",
    tabletTitle: "Arsip JD Permanen Siap Kapan Saja",
    desktopTitle: "Arsip JD Permanen, Siap Saat HRD Menelepon",
    mobileSubtitle: "Cek gaji & syarat meski loker ditutup.",
    tabletSubtitle: "Buka detail gaji & syarat loker meski iklannya tutup.",
    desktopSubtitle: "Buka kembali detail gaji, lokasi, dan syarat loker kapan saja meski iklannya sudah dihapus.",
    ctaLabel: "Buka Papan Roles",
    href: "/roles",
    image: "/images/dashboard/banner-clipper-2.png",
  },
  {
    id: "cvmatch",
    mobileTitle: "Cek Kecocokan CV",
    tabletTitle: "Ukur Kecocokan CV Sebelum Melamar",
    desktopTitle: "Ukur Kecocokan CV Otomatis Sebelum Melamar",
    mobileSubtitle: "Unggah CV PDF sekali, lihat skor tiap loker.",
    tabletSubtitle: "Unggah CV PDF privat sekali untuk skor di tiap loker.",
    desktopSubtitle: "Unggah CV PDF privat sekali dan pantau persentase kecocokan otomatis di setiap lowongan.",
    ctaLabel: "Kelola CV PDF",
    href: "/profile",
    image: "/images/dashboard/banner-clipper-1.png",
  },
];

export function HomeBannerSlider() {
  ensureGsapRegistered();
  const [index, setIndex] = useState(0);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Continuous subtle floating motion on the 3D banner illustration
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".banner-float-art", {
          y: -6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: bannerRef }
  );

  // Smooth slide transition whenever active slide index changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".banner-slide-copy",
          { x: 14, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.42, ease: "power3.out" }
        );
        gsap.fromTo(
          ".banner-float-art",
          { scale: 0.94, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }
        );
      });
    },
    { scope: bannerRef, dependencies: [index] }
  );

  const slide = SLIDES[index];

  return (
    <div
      ref={bannerRef}
      className="h-[156px] sm:h-[188px] lg:h-[208px] rounded-[24px] sm:rounded-[28px] px-4 sm:px-6 pt-4 sm:pt-5 pb-8 sm:pb-9 text-white relative overflow-hidden shadow-lg shadow-sky-700/15 flex items-center"
      style={{
        background: "linear-gradient(135deg, #0B6AA8 0%, #0E86C7 55%, #1DB3E2 100%)",
      }}
    >
      <div className="w-full flex items-center justify-between gap-3 sm:gap-5 relative z-10">
        <div className="banner-slide-copy min-w-0 flex-1 max-w-lg">
          <h2 className="text-[15px] sm:text-lg lg:text-[22px] font-medium leading-snug line-clamp-1">
            <span className="sm:hidden">{slide.mobileTitle}</span>
            <span className="hidden sm:inline lg:hidden">{slide.tabletTitle}</span>
            <span className="hidden lg:inline">{slide.desktopTitle}</span>
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs lg:text-sm text-sky-100 leading-relaxed line-clamp-2 min-h-[32px] sm:min-h-[36px] lg:min-h-[42px]">
            <span className="sm:hidden">{slide.mobileSubtitle}</span>
            <span className="hidden sm:inline lg:hidden">{slide.tabletSubtitle}</span>
            <span className="hidden lg:inline">{slide.desktopSubtitle}</span>
          </p>

          <div className="mt-2.5 sm:mt-3.5">
            {slide.action === "clipper" ? (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("nextrole:open-clipper"))}
                className="inline-flex items-center gap-1 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-medium hover:brightness-95 transition cursor-pointer"
              >
                {slide.ctaLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={slide.href ?? "/roles"}
                className="inline-flex items-center gap-1 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-medium hover:brightness-95 transition"
              >
                {slide.ctaLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        <div className="banner-float-art w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-36 flex items-center justify-center shrink-0 will-change-transform">
          <Image
            src={slide.image}
            alt={slide.desktopTitle}
            width={160}
            height={144}
            priority
            className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 3-Dot White Pill Indicator (EXACT FigCraft Slider) */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-xs">
        {SLIDES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Slide ${idx + 1}: ${item.mobileTitle}`}
            onClick={() => setIndex(idx)}
            className={cn(
              "h-2 rounded-full transition-all cursor-pointer",
              idx === index ? "w-4 bg-[#0284C7]" : "w-2 bg-sky-200 hover:bg-sky-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
