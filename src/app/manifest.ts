import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextRole — Intelligent Job Hunt Assistant",
    short_name: "NextRole",
    description:
      "Kelola lamaran kerja, arsip JD permanen, skor kecocokan CV otomatis, dan pengingat follow-up H+7.",
    start_url: "/home",
    display: "standalone",
    background_color: "#F4F9FF",
    theme_color: "#0284C7",
    icons: [
      {
        src: "/images/brand/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/brand/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/brand/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
