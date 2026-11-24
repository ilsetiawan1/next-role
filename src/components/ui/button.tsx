import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "lime" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-sm shadow-sky-600/20 disabled:opacity-50",
  secondary:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50",
  lime:
    "bg-[#D4FF47] text-[#0C4A6E] hover:brightness-95 font-semibold shadow-sm disabled:opacity-50",
  ghost:
    "bg-transparent text-slate-600 hover:bg-sky-50 hover:text-slate-900 disabled:opacity-50",
  danger:
    "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-xl",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-sm rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
}
