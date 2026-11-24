"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronLeft, Copy, Mail, Pencil, Trash2 } from "lucide-react";
import type { ApplicationStatusType } from "@/constants/application";
import { Button } from "@/components/ui/button";
import {
  formatShortDateId,
  getCompanyInitial,
  getDaysSince,
  type ApplicationDto,
} from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import {
  deleteApplicationApi,
  fetchApplicationDetail,
  generateFollowUpApi,
  updateApplicationStatusApi,
  type FollowUpResultDto,
} from "../api/detailApi";
import { InlineApplicationEditForm } from "./InlineApplicationEditForm";

const STATUS_OPTIONS: Array<{ value: ApplicationStatusType; label: string }> = [
  { value: "APPLIED", label: "Applied" },
  { value: "FOLLOW_UP_NEEDED", label: "Follow-Up" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview" },
  { value: "OFFERED", label: "Offered" },
  { value: "REJECTED", label: "Rejected" },
];

function getStatusShortLabel(status: ApplicationStatusType): string {
  switch (status) {
    case "APPLIED":
      return "Applied";
    case "FOLLOW_UP_NEEDED":
      return "Follow-Up";
    case "INTERVIEW_SCHEDULED":
      return "Interview";
    case "OFFERED":
      return "Offered";
    case "REJECTED":
    case "GHOSTED":
      return "Rejected";
  }
}

function formatCompactUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.startsWith("www.")
      ? parsed.hostname.slice(4)
      : parsed.hostname;
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    const combined = `${host}${path}`;
    return combined.length > 34 ? `${combined.slice(0, 34)}...` : combined;
  } catch {
    return rawUrl.length > 34 ? `${rawUrl.slice(0, 34)}...` : rawUrl;
  }
}

interface ApplicationDetailSheetProps {
  open: boolean;
  onClose: () => void;
  application: ApplicationDto | null;
  onStatusUpdated?: (updated: ApplicationDto) => void;
  onDeleted?: (id: string) => void;
}

export function ApplicationDetailSheet({
  open,
  onClose,
  application,
  onStatusUpdated,
  onDeleted,
}: ApplicationDetailSheetProps) {
  const [fetchedDetail, setFetchedDetail] = useState<ApplicationDto | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "jd" | "followup">("overview");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [tone, setTone] = useState<"formal" | "casual">("formal");
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [followUpState, setFollowUpState] = useState<{
    appId: string;
    result: FollowUpResultDto;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applicationId = open ? (application?.id ?? null) : null;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!applicationId) return;

    let cancelled = false;
    fetchApplicationDetail(applicationId)
      .then((fresh) => {
        if (!cancelled) setFetchedDetail(fresh);
      })
      .catch(() => {
        // Fallback tetap tampilkan data dari list
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const detail =
    application && fetchedDetail?.id === application.id ? fetchedDetail : application;
  const followUpResult =
    detail && followUpState?.appId === detail.id ? followUpState.result : null;

  if (!open || !detail) return null;

  const daysSince = getDaysSince(detail.appliedAt);

  async function handleStatusChange(nextStatus: ApplicationStatusType) {
    if (!detail || nextStatus === detail.status) return;
    setUpdatingStatus(true);
    setError(null);
    try {
      const updated = await updateApplicationStatusApi(detail.id, nextStatus);
      setFetchedDetail(updated);
      onStatusUpdated?.(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (!detail) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteApplicationApi(detail.id);
      onDeleted?.(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus lamaran.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleGenerateFollowUp() {
    if (!detail) return;
    setGeneratingDraft(true);
    setError(null);
    try {
      const res = await generateFollowUpApi({
        applicationId: detail.id,
        language,
        tone,
      });
      setFollowUpState({ appId: detail.id, result: res });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat draf follow-up.");
    } finally {
      setGeneratingDraft(false);
    }
  }

  async function handleCopyDraft() {
    if (!followUpResult) return;
    const text = `Subject: ${followUpResult.draft.subject}\n\n${followUpResult.draft.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/35 backdrop-blur-xs pt-14 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${detail.companyName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Floating Circular Back Button (persis FigCraft Mobile Bottom Sheet) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Kembali"
        className="fixed top-5 left-4 sm:top-6 sm:left-6 z-20 h-10 w-10 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Bottom Sheet (Mobile) / Modal Sheet (Tablet & Desktop) */}
      <div className="relative w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl max-h-[84dvh] sm:max-h-[88dvh] flex flex-col">
        {/* Overlapping Circular Company Logo (-top-8 centered) */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-white p-1.5 shadow-md flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-[#E0F2FE] text-[#0284C7] font-medium text-xl flex items-center justify-center">
            {getCompanyInitial(detail.companyName)}
          </div>
        </div>

        {/* Centered Header */}
        <div className="pt-10 px-5 pb-3 text-center shrink-0">
          <p className="text-xs font-medium text-[#0284C7]">{detail.companyName}</p>
          <h2 className="text-lg font-medium text-slate-900 mt-0.5 leading-snug">
            {detail.position}
          </h2>
          <p className="text-xs font-normal text-slate-500 mt-0.5">
            {detail.salaryRange ? detail.salaryRange : "Rentang gaji belum diisi"}
          </p>
        </div>

        {/* Segmented Tabs: Ringkasan | Deskripsi | Follow-Up */}
        <div className="px-5 pb-3 shrink-0">
          <div className="grid grid-cols-3 rounded-2xl bg-[#F1F5F9] p-1 text-xs">
            {[
              { id: "overview", label: "Ringkasan" },
              { id: "jd", label: "Deskripsi" },
              { id: "followup", label: "Follow-Up" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as "overview" | "jd" | "followup")}
                className={cn(
                  "h-9 rounded-xl transition cursor-pointer",
                  activeTab === item.id
                    ? "bg-white text-slate-900 font-medium shadow-xs"
                    : "text-slate-500 font-normal hover:text-slate-800"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Sheet Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pb-4 space-y-3.5">
          {error ? (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
              {error}
            </div>
          ) : null}

          {activeTab === "overview" ? (
            <>
              {/* 3-Column Info Strip */}
              <div className="grid grid-cols-3 divide-x divide-slate-200/70 rounded-2xl bg-[#F8FAFC] border border-slate-100 py-3 px-2 text-center">
                <div className="px-1">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {detail.employmentType ?? "Full-time"}
                  </p>
                  <p className="text-[11px] font-normal text-slate-500 mt-0.5">Tipe Kerja</p>
                </div>
                <div className="px-1">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {detail.location ?? "-"}
                  </p>
                  <p className="text-[11px] font-normal text-slate-500 mt-0.5">Lokasi Kerja</p>
                </div>
                <div className="px-1">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {getStatusShortLabel(detail.status)}
                  </p>
                  <p className="text-[11px] font-normal text-slate-500 mt-0.5">Status Kanban</p>
                </div>
              </div>

              {/* Sumber & Tautan Strip */}
              <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 font-normal shrink-0">
                  Sumber: <span className="text-slate-800">{detail.jobSource ?? "Manual"}</span>
                </span>
                {detail.jobUrl ? (
                  <a
                    href={detail.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[#0284C7] font-medium hover:underline truncate"
                  >
                    <span className="truncate">{formatCompactUrl(detail.jobUrl)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Tanpa tautan</span>
                )}
              </div>

              {/* Deskripsi Pekerjaan + Kecocokan CV Pill */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900">Deskripsi Pekerjaan</p>
                  {detail.matchScore !== null ? (
                    <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-medium text-[#0C4A6E]">
                      Kecocokan CV: {detail.matchScore}%
                    </span>
                  ) : (
                    <Link
                      href="/profile"
                      className="text-[11px] font-medium text-[#0284C7] hover:underline"
                    >
                      Unggah CV
                    </Link>
                  )}
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-3 text-xs font-normal text-slate-600 leading-relaxed whitespace-pre-line max-h-28 overflow-y-auto overscroll-contain">
                  {detail.jdSnapshot && detail.jdSnapshot.trim().length > 0
                    ? detail.jdSnapshot
                    : "Belum ada teks deskripsi lowongan tersimpan untuk lamaran ini."}
                </div>
              </div>

              {/* Kualifikasi Kunci Terdeteksi */}
              {detail.keyRequirements.length > 0 ? (
                <div>
                  <p className="text-[11px] font-normal text-slate-500 mb-1.5">
                    Kualifikasi Kunci Terdeteksi
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.keyRequirements.map((req) => (
                      <span
                        key={req}
                        className="rounded-full bg-[#F8FAFC] border border-slate-100 px-2.5 py-1 text-[11px] font-normal text-slate-700"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 2-Column Tanggal Melamar & Tindak Lanjut */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-3.5 py-2.5">
                  <p className="text-[11px] font-normal text-slate-500">Tanggal Melamar</p>
                  <p className="text-xs font-medium text-slate-900 mt-0.5">
                    {daysSince === 0 ? "Hari Ini" : `${daysSince} Hari Lalu`}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-3.5 py-2.5">
                  <p className="text-[11px] font-normal text-slate-500">Tindak Lanjut</p>
                  <p className="text-xs font-medium text-slate-900 mt-0.5">
                    {daysSince >= 7 ? "H+7 Hari Ini" : `H+${daysSince}`}
                  </p>
                </div>
              </div>

              {/* Ubah Status, Edit, & Arsipkan (akses cepat mobile) */}
              {editing ? (
                <InlineApplicationEditForm
                  key={detail.id}
                  application={detail}
                  onSaved={(updated) => {
                    setFetchedDetail(updated);
                    onStatusUpdated?.(updated);
                    setEditing(false);
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : null}

              <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-slate-600">Ubah Status Lamaran</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditing((v) => !v)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0284C7] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" />
                      {editing ? "Tutup" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      {deleting ? "Menghapus..." : "Arsipkan"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((opt) => {
                    const selected = detail.status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(opt.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer",
                          selected
                            ? "border-[#0284C7] bg-sky-50 text-[#0284C7]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full border",
                            selected ? "border-[#0284C7] bg-[#0284C7]" : "border-slate-300"
                          )}
                        />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {activeTab === "jd" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-900">Arsip Deskripsi Lengkap</p>
                {detail.matchScore !== null ? (
                  <span className="rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-medium text-[#0C4A6E]">
                    Kecocokan CV: {detail.matchScore}%
                  </span>
                ) : null}
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {detail.jdSnapshot && detail.jdSnapshot.trim().length > 0
                  ? detail.jdSnapshot
                  : "Belum ada teks deskripsi lowongan tersimpan untuk lamaran ini."}
              </div>

              {detail.activities && detail.activities.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-900">Riwayat Aktivitas</p>
                  <ul className="space-y-1.5">
                    {detail.activities.slice(0, 5).map((act) => (
                      <li
                        key={act.id}
                        className="flex items-start justify-between gap-3 rounded-xl bg-[#F8FAFC] border border-slate-100 px-3 py-2 text-xs"
                      >
                        <span className="text-slate-700">{act.notes ?? act.actionType}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {formatShortDateId(act.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === "followup" ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between rounded-2xl bg-sky-50/80 border border-sky-100 px-3.5 py-3">
                <div>
                  <p className="text-xs font-medium text-slate-900">Status Tindak Lanjut (H+7)</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Sudah {daysSince} hari sejak dilamar ({formatShortDateId(detail.appliedAt)}).
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    daysSince >= 7
                      ? "bg-[#D4FF47] text-[#0C4A6E]"
                      : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  {daysSince >= 7 ? "Siap Follow-Up" : `H+${daysSince}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <p className="text-[11px] font-medium text-slate-600 mb-1.5">Bahasa</p>
                  <div className="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1 text-xs">
                    {(["id", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          "h-8 rounded-lg transition cursor-pointer",
                          language === lang
                            ? "bg-white text-slate-900 font-medium shadow-xs"
                            : "text-slate-500"
                        )}
                      >
                        {lang === "id" ? "Indonesia" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-600 mb-1.5">Nada Pesan</p>
                  <div className="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1 text-xs">
                    {(["formal", "casual"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={cn(
                          "h-8 rounded-lg transition cursor-pointer",
                          tone === t
                            ? "bg-white text-slate-900 font-medium shadow-xs"
                            : "text-slate-500"
                        )}
                      >
                        {t === "formal" ? "Formal" : "Santai"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {followUpResult ? (
                <div className="rounded-2xl bg-[#F8FAFC] border border-sky-100 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {followUpResult.draft.subject}
                    </p>
                    <Button variant="lime" size="sm" onClick={handleCopyDraft}>
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Tersalin" : "Salin"}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {followUpResult.draft.body}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-4 text-center">
                  <Mail className="h-5 w-5 text-[#0284C7] mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600">
                    Tekan tombol di bawah untuk membuat draf pesan follow-up sopan otomatis.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Sticky Bottom Pill CTA (persis FigCraft "Draf Pesan HRD ↗") */}
        <div className="px-5 pt-2.5 pb-5 bg-white border-t border-slate-100/80 shrink-0 rounded-b-[32px]">
          {activeTab === "followup" ? (
            <button
              type="button"
              onClick={handleGenerateFollowUp}
              disabled={generatingDraft}
              className="w-full h-12 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-medium inline-flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition cursor-pointer disabled:opacity-60"
            >
              {generatingDraft ? "Menyusun Draf..." : "Buat Draf Pesan HRD"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab("followup")}
              className="w-full h-12 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-medium inline-flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition cursor-pointer"
            >
              Draf Pesan HRD
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
