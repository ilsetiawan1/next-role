"use client";

import { useRef, useState } from "react";
import { ImageIcon, Link2, FileText, Sparkles, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { createApplicationApi, extractJobWithAi } from "../api/clipperApi";

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
  const [posterBase64, setPosterBase64] = useState<string | null>(null);
  const [posterMime, setPosterMime] = useState<"image/png" | "image/jpeg" | "image/webp" | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const posterInputRef = useRef<HTMLInputElement | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cachedNotice, setCachedNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields (Manual & Pratinjau Hasil AI)
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobSource, setJobSource] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [jdSnapshot, setJdSnapshot] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterContact, setRecruiterContact] = useState("");

  function resetForm() {
    setRawContent("");
    setCachedNotice(null);
    setError(null);
    setCompanyName("");
    setPosition("");
    setLocation("");
    setEmploymentType("Full-time");
    setSalaryRange("");
    setJobSource("");
    setJobUrl("");
    setRequirementsText("");
    setJdSnapshot("");
    setRecruiterName("");
    setRecruiterContact("");
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
    setPosterMime(mime);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx !== -1) {
        setPosterPreview(dataUrl);
        setPosterBase64(dataUrl.slice(commaIdx + 1));
      }
    };
    reader.readAsDataURL(file);
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
      setEmploymentType(d.employmentType ?? "Full-time");
      setSalaryRange(d.salaryRange ?? "");
      setJobSource(d.jobSource ?? "");
      if (inputType === "JOB_URL") setJobUrl(rawContent.trim());
      setRequirementsText(d.keyRequirements.join(", "));
      setJdSnapshot(d.jdSnapshot);
      onQuotaChange?.(res.meta.quotaUsed);
      setCachedNotice(
        res.meta.cached
          ? "Hasil diambil dari cache SHA-256 (0 kuota AI terpotong). Periksa lalu simpan."
          : "Berhasil diekstrak oleh AI. Periksa detailnya lalu simpan ke papan."
      );
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
    <Modal
      open={open}
      onClose={onClose}
      title="Catat Lamaran Baru"
      subtitle="Ekstrak otomatis dari teks/link lowongan atau isi form manual. Lamaran otomatis masuk ke tahap Applied."
    >
      {/* Mode Tabs + Kuota Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer",
              tab === "ai" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Otomatis (AI)
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer",
              tab === "manual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Manual / Pratinjau
          </button>
        </div>

        <span className="inline-flex items-center rounded-full bg-[#D4FF47] px-3 py-1 text-xs font-bold text-[#0C4A6E]">
          {quotaUsed} / {quotaLimit} Klip Hari Ini
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700"
        >
          {error}
        </div>
      ) : null}

      {cachedNotice ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{cachedNotice}</span>
        </div>
      ) : null}

      {tab === "ai" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setInputType("RAW_TEXT")}
              className={cn(
                "flex items-center justify-center gap-1.5 h-11 rounded-xl border text-xs font-semibold transition cursor-pointer px-2",
                inputType === "RAW_TEXT"
                  ? "border-sky-500 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">Teks</span>
            </button>
            <button
              type="button"
              onClick={() => setInputType("JOB_URL")}
              className={cn(
                "flex items-center justify-center gap-1.5 h-11 rounded-xl border text-xs font-semibold transition cursor-pointer px-2",
                inputType === "JOB_URL"
                  ? "border-sky-500 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <Link2 className="h-4 w-4 shrink-0" />
              <span className="truncate">Link URL</span>
            </button>
            <button
              type="button"
              onClick={() => setInputType("POSTER_IMAGE")}
              className={cn(
                "flex items-center justify-center gap-1.5 h-11 rounded-xl border text-xs font-semibold transition cursor-pointer px-2",
                inputType === "POSTER_IMAGE"
                  ? "border-sky-500 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <ImageIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Poster / Foto</span>
            </button>
          </div>

          {inputType === "POSTER_IMAGE" ? (
            <div className="space-y-3">
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
                className="w-full rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/40 hover:bg-sky-50 p-6 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer"
              >
                <Upload className="h-6 w-6 text-[#0284C7]" />
                <p className="text-xs font-bold text-slate-800">
                  {posterFileName ?? "Unggah Poster / Screenshot Lowongan"}
                </p>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG, atau WebP (maks 5 MB) — brosur loker IG, LinkedIn, atau screenshot
                </p>
              </button>
              {posterPreview ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterPreview}
                    alt="Pratinjau poster lowongan"
                    className="max-h-44 rounded-lg object-contain"
                  />
                </div>
              ) : null}
            </div>
          ) : inputType === "JOB_URL" ? (
            <Input
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
            />
          ) : (
            <Textarea
              rows={7}
              placeholder="Salin dan tempel seluruh deskripsi lowongan kerja di sini (nama perusahaan, posisi, gaji, syarat)..."
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
            />
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">
              Ditenagai Gemini 3.5 Flash Lite + cache SHA-256 otomatis.
            </p>
            <Button onClick={handleExtract} disabled={extracting}>
              <Sparkles className="h-4 w-4" />
              {extracting ? "Mengekstrak..." : "Ekstrak dengan AI"}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Perusahaan *
              </label>
              <Input
                required
                placeholder="Contoh: PT Teknologi Nusantara"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Posisi / Role *
              </label>
              <Input
                required
                placeholder="Contoh: Frontend Engineer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi</label>
              <Input
                placeholder="Jakarta Selatan (Hybrid)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipe Kerja
              </label>
              <Input
                placeholder="Full-time / Contract / Remote"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Perkiraan Rentang Gaji
              </label>
              <Input
                placeholder="Rp 15.000.000 - Rp 20.000.000"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sumber Lowongan
              </label>
              <Input
                placeholder="LinkedIn / Glints / JobStreet"
                value={jobSource}
                onChange={(e) => setJobSource(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tautan Lowongan (Opsional)
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kualifikasi Kunci (pisahkan dengan koma)
            </label>
            <Input
              placeholder="React, Next.js, TypeScript, REST API"
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Arsip Deskripsi Pekerjaan (JD Snapshot)
            </label>
            <Textarea
              rows={4}
              placeholder="Teks lengkap deskripsi lowongan disimpan permanen agar tetap bisa dibaca saat iklan ditutup..."
              value={jdSnapshot}
              onChange={(e) => setJdSnapshot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Recruiter (Opsional)
              </label>
              <Input
                placeholder="Ibu Rina"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kontak Recruiter (Opsional)
              </label>
              <Input
                placeholder="recruiter@perusahaan.id"
                value={recruiterContact}
                onChange={(e) => setRecruiterContact(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Lamaran"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
