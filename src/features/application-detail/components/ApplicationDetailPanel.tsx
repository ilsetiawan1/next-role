"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Mail, Trash2 } from "lucide-react";
import type { ApplicationStatusType } from "@/constants/application";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/primitives";
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

const RADIO_STATUSES: Array<{ value: ApplicationStatusType; label: string }> = [
  { value: "APPLIED", label: "Applied" },
  { value: "FOLLOW_UP_NEEDED", label: "Follow-Up" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview" },
  { value: "OFFERED", label: "Offered" },
  { value: "REJECTED", label: "Rejected" },
];

interface ApplicationDetailPanelProps {
  application: ApplicationDto | null;
  onStatusUpdated?: (updated: ApplicationDto) => void;
  onDeleted?: (id: string) => void;
}

export function ApplicationDetailPanel({
  application,
  onStatusUpdated,
  onDeleted,
}: ApplicationDetailPanelProps) {
  const [fetchedDetail, setFetchedDetail] = useState<ApplicationDto | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "jd" | "followup">("overview");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [tone, setTone] = useState<"formal" | "casual">("formal");
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [followUpState, setFollowUpState] = useState<{
    appId: string;
    result: FollowUpResultDto;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applicationId = application?.id ?? null;

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

  if (!detail) {
    return (
      <div className="glass-surface rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
        <p className="text-sm font-semibold text-slate-800">Pilih kartu lamaran</p>
        <p className="mt-1.5 text-xs text-slate-500 max-w-xs">
          Klik salah satu kartu lamaran untuk membaca arsip JD permanen, skor kecocokan CV, atau
          membuat draf follow-up H+7.
        </p>
      </div>
    );
  }

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
    <div className="glass-surface rounded-3xl p-5 sm:p-6 space-y-5">
      {/* Header Lamaran */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center shrink-0">
            {getCompanyInitial(detail.companyName)}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">{detail.companyName}</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {detail.position}
              {detail.location ? ` • ${detail.location}` : ""}
            </p>
          </div>
        </div>
        <StatusBadge status={detail.status} className="shrink-0" />
      </div>

      {/* Segmented Tabs */}
      <div className="grid grid-cols-3 rounded-xl bg-slate-100/90 p-1 text-xs font-semibold">
        {[
          { id: "overview", label: "Ringkasan" },
          { id: "jd", label: "Arsip JD" },
          { id: "followup", label: "Follow-Up" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id as "overview" | "jd" | "followup")}
            className={cn(
              "h-9 rounded-lg transition cursor-pointer",
              activeTab === item.id
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
          {error}
        </div>
      ) : null}

      {activeTab === "overview" ? (
        <div className="space-y-5">
          {/* 3-Kolom Info Strip (sesuai desain FigCraft Inspector) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-sky-50/60 border border-sky-100/80 p-3.5 text-xs">
            <div>
              <p className="text-slate-500">Rentang Gaji</p>
              <p className="mt-0.5 font-semibold text-slate-900">{detail.salaryRange ?? "Belum diisi"}</p>
            </div>
            <div>
              <p className="text-slate-500">Tipe Kerja</p>
              <p className="mt-0.5 font-semibold text-slate-900">{detail.employmentType ?? "-"}</p>
            </div>
            <div>
              <p className="text-slate-500">Tanggal Dilamar</p>
              <p className="mt-0.5 font-semibold text-slate-900">{formatShortDateId(detail.appliedAt)}</p>
            </div>
            <div>
              <p className="text-slate-500">Sumber</p>
              <p className="mt-0.5 font-semibold text-slate-900">{detail.jobSource ?? "-"}</p>
            </div>
            <div>
              <p className="text-slate-500">Kontak Recruiter</p>
              <p className="mt-0.5 font-semibold text-slate-900 truncate">
                {detail.recruiterContact ?? detail.recruiterName ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Kecocokan CV</p>
              {detail.matchScore !== null ? (
                <span className="mt-0.5 inline-flex rounded-full bg-[#D4FF47] px-2.5 py-0.5 text-[11px] font-bold text-[#0C4A6E]">
                  {detail.matchScore}% Cocok
                </span>
              ) : (
                <Link href="/profile" className="mt-0.5 inline-block font-semibold text-[#0284C7] hover:underline">
                  Unggah CV
                </Link>
              )}
            </div>
          </div>

          {/* Kontrol Ubah Status Langsung */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5">
            <p className="text-xs font-semibold text-slate-700 mb-2.5">Ubah Status Lamaran:</p>
            <div className="flex flex-wrap gap-2">
              {RADIO_STATUSES.map((opt) => {
                const selected = detail.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(opt.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition cursor-pointer",
                      selected
                        ? "border-[#0284C7] bg-sky-50 text-[#0284C7]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full border",
                        selected ? "border-[#0284C7] bg-[#0284C7]" : "border-slate-300"
                      )}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Riwayat Aktivitas */}
          <div>
            <p className="text-xs font-bold text-slate-800 mb-2">Riwayat Aktivitas</p>
            {detail.activities && detail.activities.length > 0 ? (
              <ul className="space-y-2">
                {detail.activities.slice(0, 5).map((act) => (
                  <li
                    key={act.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-white/75 border border-slate-100 px-3 py-2 text-xs"
                  >
                    <span className="text-slate-700">{act.notes ?? act.actionType}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatShortDateId(act.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Belum ada catatan aktivitas tambahan.</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {detail.jobUrl ? (
              <a
                href={detail.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:underline"
              >
                Buka Tautan Asli
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span />
            )}

            <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? "Menghapus..." : "Arsipkan"}
            </Button>
          </div>
        </div>
      ) : null}

      {activeTab === "jd" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-800">Arsip Deskripsi Pekerjaan</p>
            {detail.matchScore !== null ? (
              <span className="rounded-full bg-[#D4FF47] px-3 py-1 text-xs font-bold text-[#0C4A6E]">
                Kecocokan CV: {detail.matchScore}%
              </span>
            ) : null}
          </div>

          {detail.keyRequirements.length > 0 ? (
            <div>
              <p className="text-xs text-slate-500 mb-2">Kualifikasi Kunci Terdeteksi</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.keyRequirements.map((req) => (
                  <span
                    key={req}
                    className="rounded-full bg-white border border-sky-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white/90 border border-slate-100 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
            {detail.jdSnapshot && detail.jdSnapshot.trim().length > 0
              ? detail.jdSnapshot
              : "Belum ada teks deskripsi lowongan tersimpan untuk lamaran ini."}
          </div>
        </div>
      ) : null}

      {activeTab === "followup" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-sky-50/80 border border-sky-100 px-4 py-3">
            <div>
              <p className="text-xs font-bold text-slate-900">Status Tindak Lanjut (H+7)</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Sudah {daysSince} hari sejak dilamar ({formatShortDateId(detail.appliedAt)}).
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                daysSince >= 7
                  ? "bg-[#D4FF47] text-[#0C4A6E]"
                  : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {daysSince >= 7 ? "Siap Follow-Up" : `H+${daysSince}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1.5">Bahasa</p>
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                {(["id", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "h-8 rounded-lg transition cursor-pointer",
                      language === lang ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    )}
                  >
                    {lang === "id" ? "Indonesia" : "English"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1.5">Nada Pesan</p>
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                {(["formal", "casual"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "h-8 rounded-lg transition cursor-pointer",
                      tone === t ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    )}
                  >
                    {t === "formal" ? "Formal" : "Santai"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleGenerateFollowUp} disabled={generatingDraft} className="w-full">
            <Mail className="h-4 w-4" />
            {generatingDraft ? "Menyusun Draf..." : "Buat Draf Pesan Follow-Up"}
          </Button>

          {followUpResult ? (
            <div className="rounded-2xl bg-white border border-sky-100 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 truncate">
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
