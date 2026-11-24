"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  ImageIcon,
  Link2,
  Upload,
  X,
} from "lucide-react";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { createApplicationApi, extractJobWithAi } from "../api/clipperApi";

const WORK_TYPES = ["Remote", "Hybrid", "On-Site"] as const;
const JOB_SOURCES = ["LinkedIn", "JobStreet", "Glints", "Lainnya"] as const;

interface ClipperModalProps {
  open: boolean;
  onClose: () => void;
  quotaUsed: number;
  quotaLimit: number;
  onQuotaChange?: (used: number) => void;
  onCreated?: (app: ApplicationDto) => void;
}

export function ClipperModal({
  open,
  onClose,
  quotaUsed,
  quotaLimit,
  onQuotaChange,
  onCreated,
}: ClipperModalProps) {
  const [tab, setTab] = useState<"ai" | "manual">("ai");
  const [inputType, setInputType] = useState<"RAW_TEXT" | "JOB_URL" | "POSTER_IMAGE">("RAW_TEXT");
  const [rawContent, setRawContent] = useState("");
  const [posterFileName, setPosterFileName] = useState<string | null>(null);
  const [posterFileSizeKb, setPosterFileSizeKb] = useState<number | null>(null);
  const [posterBase64, setPosterBase64] = useState<string | null>(null);
  const [posterMime, setPosterMime] = useState<"image/png" | "image/jpeg" | "image/webp" | null>(
    null
  );
  const posterInputRef = useRef<HTMLInputElement | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cachedNotice, setCachedNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExtraFields, setShowExtraFields] = useState(false);

  // Form fields (Manual & Pratinjau Hasil AI)
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<string>("Hybrid");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobSource, setJobSource] = useState<string>("LinkedIn");
  const [jobUrl, setJobUrl] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [jdSnapshot, setJdSnapshot] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterContact, setRecruiterContact] = useState("");

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

  if (!open) return null;

  const remainingQuota = Math.max(0, quotaLimit - quotaUsed);

  function resetForm() {
    setRawContent("");
    setPosterFileName(null);
    setPosterFileSizeKb(null);
    setPosterBase64(null);
    setPosterMime(null);
    setCachedNotice(null);
    setError(null);
    setCompanyName("");
    setPosition("");
    setLocation("");
    setEmploymentType("Hybrid");
    setSalaryRange("");
    setJobSource("LinkedIn");
    setJobUrl("");
    setRequirementsText("");
    setJdSnapshot("");
    setRecruiterName("");
    setRecruiterContact("");
    setShowExtraFields(false);
    setTab("ai");
  }

  function handlePosterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar poster lowongan maksimal 5 MB.");
      return;
    }
    const allowed: Array<"image/png" | "image/jpeg" | "image/webp"> = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    const mime = allowed.find((m) => m === file.type);
    if (!mime) {
      setError("Format poster harus PNG, JPG, atau WebP.");
      return;
    }
    setError(null);
    setPosterFileName(file.name);
    setPosterFileSizeKb(Math.max(1, Math.round(file.size / 1024)));
    setPosterMime(mime);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx !== -1) {
        setPosterBase64(dataUrl.slice(commaIdx + 1));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handlePasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setRawContent(text.trim());
    } catch {
      // Abaikan jika browser membatasi akses clipboard
    }
  }

  async function handleExtract() {
    if (inputType === "POSTER_IMAGE") {
      if (!posterBase64 || !posterMime) {
        setError("Unggah gambar poster atau screenshot lowongan terlebih dahulu.");
        return;
      }
    } else if (rawContent.trim().length < 10) {
      setError("Tempel minimal 10 karakter teks atau tautan lowongan terlebih dahulu.");
      return;
    }
    setError(null);
    setCachedNotice(null);
    setExtracting(true);

    try {
      const res =
        inputType === "POSTER_IMAGE"
          ? await extractJobWithAi({
              inputType: "POSTER_IMAGE",
              imageBase64: posterBase64 ?? undefined,
              mimeType: posterMime ?? undefined,
            })
          : await extractJobWithAi({ inputType, content: rawContent.trim() });
      const d = res.data;
      setCompanyName(d.companyName);
      setPosition(d.position);
      setLocation(d.location ?? "");
      setEmploymentType(d.employmentType ?? "");
      setSalaryRange(d.salaryRange ?? "");
      setJobSource(d.jobSource ?? (inputType === "POSTER_IMAGE" ? "Lainnya" : ""));
      if (inputType === "JOB_URL") setJobUrl(rawContent.trim());
      setRequirementsText(d.keyRequirements.join(", "));
      setJdSnapshot(d.jdSnapshot);
      onQuotaChange?.(res.meta.quotaUsed);
      setCachedNotice(
        res.meta.cached
          ? "Data lowongan sudah tersimpan sebelumnya (0 kuota terpotong). Periksa lalu simpan."
          : "Berhasil diekstrak oleh AI. Periksa detailnya lalu simpan."
      );
      setShowExtraFields(true);
      setTab("manual");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengekstrak lowongan.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const keyRequirements = requirementsText
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const created = await createApplicationApi({
        companyName: companyName.trim(),
        position: position.trim(),
        location: location.trim() || null,
        employmentType: employmentType.trim() || null,
        salaryRange: salaryRange.trim() || null,
        jobSource: jobSource.trim() || null,
        jobUrl: jobUrl.trim() || null,
        keyRequirements,
        jdSnapshot: jdSnapshot.trim() || null,
        recruiterName: recruiterName.trim() || null,
        recruiterContact: recruiterContact.trim() || null,
      });

      onCreated?.(created);
      window.dispatchEvent(new CustomEvent("nextrole:application-created", { detail: created }));
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan lamaran.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Catat Lamaran Baru"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-105 sm:max-w-115 rounded-[28px] bg-white shadow-2xl border border-white/90 max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Compact FigCraft Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
              Catat Lamaran Baru
            </h2>
            <p className="text-[11px] sm:text-xs font-normal text-slate-500 mt-0.5 truncate">
              {tab === "ai"
                ? "Ekstrak otomatis info loker dari teks, link, atau poster"
                : "Simpan lowongan kerja ke pipeline karir Anda"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="h-8 w-8 rounded-full bg-slate-100/90 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center shrink-0 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Full-Width Segmented Mode Tabs: Otomatis (AI) | Manual */}
        <div className="px-5 pb-3 shrink-0">
          <div className="grid grid-cols-2 rounded-2xl bg-[#F1F5F9] p-1 text-xs">
            <button
              type="button"
              onClick={() => setTab("ai")}
              className={cn(
                "h-9 rounded-xl transition cursor-pointer",
                tab === "ai"
                  ? "bg-white text-[#0284C7] font-medium shadow-xs"
                  : "text-slate-500 font-normal hover:text-slate-800"
              )}
            >
              Otomatis (AI)
            </button>
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={cn(
                "h-9 rounded-xl transition cursor-pointer",
                tab === "manual"
                  ? "bg-white text-[#0284C7] font-medium shadow-xs"
                  : "text-slate-500 font-normal hover:text-slate-800"
              )}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Scrollable Body (designed to fit 1 screen on mobile without scrolling) */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {error ? (
            <div
              role="alert"
              className="mb-3 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-medium text-rose-700"
            >
              {error}
            </div>
          ) : null}

          {cachedNotice ? (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-medium text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>{cachedNotice}</span>
            </div>
          ) : null}

          {tab === "ai" ? (
            <div className="space-y-3">
              {/* 3-Option Sub-Tab Selector (Teks | Link URL | Poster) */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "RAW_TEXT" as const, label: "Teks", icon: FileText },
                  { id: "JOB_URL" as const, label: "Link URL", icon: Link2 },
                  { id: "POSTER_IMAGE" as const, label: "Poster", icon: ImageIcon },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = inputType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setInputType(opt.id)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 h-9 rounded-xl border text-xs transition cursor-pointer px-2",
                        active
                          ? "border-sky-300 bg-sky-50 text-[#0284C7] font-medium"
                          : "border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Soft Sky Dropzone / Input Surface (persis FigCraft Smart Clipper) */}
              <div className="rounded-2xl bg-[#F0F7FF] border border-sky-200/80 p-3.5 space-y-2.5">
                {inputType === "POSTER_IMAGE" ? (
                  <>
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handlePosterChange}
                    />
                    <button
                      type="button"
                      onClick={() => posterInputRef.current?.click()}
                      className="w-full py-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer"
                    >
                      <span className="h-10 w-10 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center">
                        <Upload className="h-4 w-4" />
                      </span>
                      <p className="text-xs font-medium text-[#0284C7]">
                        Tarik atau pilih poster lowongan ke sini
                      </p>
                      <p className="text-[11px] font-normal text-slate-500">
                        PNG, JPG, atau WebP (maks 5 MB)
                      </p>
                    </button>

                    {posterFileName ? (
                      <div className="rounded-xl bg-white border border-sky-100 px-3 py-2 flex items-center gap-2.5">
                        <span className="h-7 w-7 rounded-lg bg-sky-50 text-[#0284C7] text-[10px] font-medium flex items-center justify-center shrink-0 uppercase">
                          IMG
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 truncate">
                            {posterFileName}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {posterFileSizeKb ? `${posterFileSizeKb} KB` : "Siap"} • Siap diekstrak
                          </p>
                          <div className="mt-1 h-1 w-full rounded-full bg-sky-100 overflow-hidden">
                            <div className="h-full w-full rounded-full bg-[#0284C7]" />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : inputType === "JOB_URL" ? (
                  <div className="py-2 space-y-2">
                    <p className="text-[11px] font-medium text-[#0284C7] text-center">
                      Tempel tautan lowongan dari LinkedIn, Glints, atau JobStreet
                    </p>
                    <div className="flex items-center gap-1.5 rounded-xl bg-white border border-sky-200/80 p-1">
                      <input
                        type="url"
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        value={rawContent}
                        onChange={(e) => setRawContent(e.target.value)}
                        className="flex-1 min-w-0 h-8 px-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        className="h-8 px-3 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-medium hover:bg-sky-200 transition shrink-0 cursor-pointer"
                      >
                        Tempel
                      </button>
                    </div>
                  </div>
                ) : (
                  <textarea
                    rows={5}
                    placeholder="Salin dan tempel seluruh deskripsi lowongan kerja di sini (nama perusahaan, posisi, gaji, syarat)..."
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    className="w-full rounded-xl bg-white border border-sky-100 px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
                  />
                )}
              </div>

              {/* Green Quota Strip (persis FigCraft) */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-[11px] font-normal text-emerald-700 text-center">
                Sisa Kuota: {remainingQuota} / {quotaLimit} klip hari ini • Ekstraksi AI Otomatis
              </div>

              {/* Footer Actions */}
              <div className="grid grid-cols-12 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={extracting}
                  className="col-span-4 h-11 rounded-2xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition cursor-pointer disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={extracting}
                  className="col-span-8 h-11 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-60"
                >
                  {extracting ? "Mengekstrak..." : "Ekstrak dengan AI"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Nama Perusahaan
                </label>
                <input
                  required
                  placeholder="Contoh: Tokopedia, Shopee, GoTo"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Posisi / Role Lowongan
                </label>
                <input
                  required
                  placeholder="Contoh: Senior Frontend Engineer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Tipe Kerja Pills (Remote | Hybrid | On-Site) */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Tipe Kerja
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {WORK_TYPES.map((wt) => {
                    const active = employmentType.toLowerCase() === wt.toLowerCase();
                    return (
                      <button
                        key={wt}
                        type="button"
                        onClick={() => setEmploymentType(wt)}
                        className={cn(
                          "h-8 rounded-xl text-xs transition cursor-pointer",
                          active
                            ? "bg-sky-100 text-[#0284C7] font-medium"
                            : "bg-slate-100/80 text-slate-600 font-normal hover:bg-slate-200/70"
                        )}
                      >
                        {wt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Perkiraan Rentang Gaji (Opsional)
                </label>
                <input
                  placeholder="Contoh: Rp 18.000.000 - 25.000.000"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Sumber Lowongan Pills (LinkedIn | JobStreet | Glints | Lainnya) */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Sumber Lowongan (Opsional)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {JOB_SOURCES.map((src) => {
                    const active = jobSource.toLowerCase() === src.toLowerCase();
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setJobSource(src)}
                        className={cn(
                          "h-8 rounded-xl text-[11px] transition cursor-pointer",
                          active
                            ? "bg-sky-100 text-[#0284C7] font-medium"
                            : "bg-slate-100/80 text-slate-600 font-normal hover:bg-slate-200/70"
                        )}
                      >
                        {src}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="url"
                  placeholder="Tempel tautan lowongan (opsional)..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="mt-1.5 w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Deskripsi Pekerjaan &amp; Kualifikasi
                </label>
                <textarea
                  rows={2}
                  placeholder="Tempel deskripsi: React, Next.js, TypeScript, REST API, min. 2 th pengalaman..."
                  value={jdSnapshot}
                  onChange={(e) => setJdSnapshot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              {/* Collapsible Detail Tambahan (Lokasi, Skill, Kontak Recruiter) */}
              <button
                type="button"
                onClick={() => setShowExtraFields((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0284C7] hover:underline cursor-pointer"
              >
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", showExtraFields && "rotate-180")}
                />
                {showExtraFields
                  ? "Sembunyikan detail tambahan"
                  : "Detail tambahan (lokasi, skill, kontak HRD)"}
              </button>

              {showExtraFields ? (
                <div className="space-y-2 rounded-xl bg-slate-50/80 border border-slate-100 p-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Lokasi (Jakarta Selatan)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                    <input
                      placeholder="Skill (React, TypeScript)"
                      value={requirementsText}
                      onChange={(e) => setRequirementsText(e.target.value)}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Nama Recruiter"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                    <input
                      placeholder="Kontak Recruiter"
                      value={recruiterContact}
                      onChange={(e) => setRecruiterContact(e.target.value)}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
              ) : null}

              {/* Green Kanban Auto-Status Strip (persis FigCraft) */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-[11px] font-normal text-emerald-700 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>Lamaran otomatis dicatat ke kolom Applied di Kanban</span>
              </div>

              {/* Footer Actions */}
              <div className="grid grid-cols-12 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="col-span-4 h-11 rounded-2xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition cursor-pointer disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="col-span-8 h-11 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium shadow-sm transition cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Lamaran"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
