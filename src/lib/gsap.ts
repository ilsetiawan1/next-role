"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function ensureGsapRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
  registered = true;
}

export function animateCountUp(
  el: Element,
  target: number,
  options?: { suffix?: string; padZero?: boolean; duration?: number }
) {
  const suffix = options?.suffix ?? "";
  const padZero = options?.padZero ?? false;
  const duration = options?.duration ?? 0.9;
  const counter = { val: 0 };

  return gsap.to(counter, {
    val: target,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const rounded = Math.round(counter.val);
      const formatted = padZero ? String(rounded).padStart(2, "0") : String(rounded);
      el.textContent = `${formatted}${suffix}`;
    },
  });
}

export { gsap, Flip, ScrollTrigger, useGSAP };
