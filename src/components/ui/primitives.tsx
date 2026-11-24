import type { HTMLAttributes } from "react";
import type { ApplicationStatusType } from "@/constants/application";
import { cn } from "@/lib/cn";

export const STATUS_META: Record<
  ApplicationStatusType,
  { label: string; pillClass: string; dotClass: string }
> = {
  APPLIED: {
    label: "Applied",
    pillClass: "bg-blue-50 text-blue-700 border border-blue-100",
    dotClass: "bg-blue-600",
  },
  FOLLOW_UP_NEEDED: {
    label: "Follow-Up (H+7)",
    pillClass: "bg-amber-50 text-amber-700 border border-amber-100",
    dotClass: "bg-amber-500",
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview",
    pillClass: "bg-purple-50 text-purple-700 border border-purple-100",
    dotClass: "bg-purple-600",
  },
  OFFERED: {
    label: "Offered",
    pillClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    dotClass: "bg-emerald-600",
  },
  REJECTED: {
    label: "Rejected",
    pillClass: "bg-rose-50 text-rose-700 border border-rose-100",
    dotClass: "bg-rose-600",
  },
  GHOSTED: {
    label: "Ghosted",
    pillClass: "bg-rose-50 text-rose-700 border border-rose-100",
    dotClass: "bg-rose-500",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatusType;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        meta.pillClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-surface rounded-3xl", className)} {...props} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-sky-100/70", className)} />;
}
