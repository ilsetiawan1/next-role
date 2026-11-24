"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import { formatShortDateId, type ProfileDto } from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { deleteCvApi, uploadCvApi } from "../api/profileApi";

interface CvProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: ProfileDto;
  onProfileUpdated: (updated: ProfileDto, notice: string) => void;
  onOpenPreview: () => void;
  loadingPreview?: boolean;
}

export function CvProfileModal({
  open,
  onClose,
  profile,
  onProfileUpdated,
  onOpenPreview,
  loadingPreview = false,
}: CvProfileModalProps) {
  ensureGsapRegistered();
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          modalCardRef.current,
          { scale: 0.96, y: 12, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.28, ease: "power2.out", clearProps: "transform" }
        );
      });
    },
    { scope: modalCardRef, dependencies: [open] }
  );

  if (!open) return null;

  function validateAndStageFile(file: File | undefined) {
    if (!file) return;
    const isPdfType =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfType) {
      setError("Format file harus PDF (.pdf).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file CV PDF maksimal 5 MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    validateAndStageFile(e.dataTransfer.files?.[0]);
  }

  async function handleSaveUpload() {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const updated = await uploadCvApi(selectedFile);
      const notice = updated.reembedded
        ? "CV PDF berhasil disimpan secara privat & skor kecocokan lowongan telah diperbarui."
        : "CV PDF berhasil diperbarui (isi CV sama, skor kecocokan tetap aktif).";
      setSelectedFile(null);
      onProfileUpdated(updated, notice);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah CV PDF.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteExisting() {
    setError(null);
    setDeleting(true);
    try {
      await deleteCvApi();
      onProfileUpdated(
        {
          ...profile,
          cv: { fileName: null, updatedAt: null, hasCv: false, textPreview: null },
        },
        "CV PDF berhasil dihapus secara permanen dari akunmu."
      );
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus CV PDF.");
    } finally {
      setDeleting(false);
    }
  }

  const displayFileName = selectedFile?.name ?? profile.cv.fileName ?? "Belum ada file PDF";
  const displayMeta = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap diunggah`
    : profile.cv.hasCv
      ? `Tersimpan privat • Diperbarui ${profile.cv.updatedAt ? formatShortDateId(profile.cv.updatedAt) : "-"}`
      : "Pilih file PDF CV di area atas";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Profil CV dan Skill"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalCardRef}
        className="w-full max-w-105 sm:max-w-115 rounded-[28px] bg-white shadow-2xl border border-white/90 p-5 space-y-4 max-h-[92dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
              Profil CV &amp; Skill
            </h2>
            <p className="text-[11px] sm:text-xs font-normal text-slate-500 mt-0.5">
              CV disimpan secara privat &amp; hanya bisa diakses oleh akunmu
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

        {error ? (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-medium text-rose-700"
          >
            {error}
          </div>
        ) : null}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            validateAndStageFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {/* Soft Sky Drag-and-Drop / Click Upload Box (persis FigCraft Modal Kelola CV) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-2xl border px-4 py-6 flex flex-col items-center justify-center text-center transition cursor-pointer",
            dragActive
              ? "border-[#0284C7] bg-sky-50"
              : "border-sky-200/80 bg-[#F4F9FF] hover:bg-sky-50/80"
          )}
        >
          <span className="h-10 w-10 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center mb-2">
            <Upload className="h-4 w-4" />
          </span>
          <p className="text-xs font-medium text-[#0284C7]">Unggah atau ganti file PDF CV</p>
          <p className="text-[11px] font-normal text-slate-500 mt-0.5">
            Format PDF • Maksimal 5 MB
          </p>
        </div>

        {/* Active / Selected File Row */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-xs px-3.5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-medium flex items-center justify-center shrink-0">
              PDF
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{displayFileName}</p>
              <p className="text-[11px] font-normal text-slate-500 truncate mt-0.5">
                {displayMeta}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {selectedFile ? (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-xl bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal Pilih
              </button>
            ) : profile.cv.hasCv ? (
              <>
                <button
                  type="button"
                  onClick={onOpenPreview}
                  disabled={loadingPreview}
                  className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-medium text-[#0284C7] hover:bg-sky-100 transition cursor-pointer disabled:opacity-60"
                >
                  {loadingPreview ? "..." : "Preview"}
                </button>
                <button
                  type="button"
                  aria-label="Hapus CV PDF"
                  onClick={handleDeleteExisting}
                  disabled={deleting}
                  className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Ringkasan Teks Terdeteksi */}
        <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-3.5 space-y-1">
          <p className="text-[11px] font-normal text-slate-500">Ringkasan Teks Terdeteksi</p>
          <p className="text-xs font-normal text-slate-700 leading-relaxed line-clamp-4">
            {selectedFile
              ? "Teks dan keahlian dari PDF baru akan diekstrak otomatis saat kamu menekan Simpan & Perbarui."
              : profile.cv.textPreview && profile.cv.textPreview.trim().length > 0
                ? profile.cv.textPreview
                : "Belum ada teks CV terdeteksi. Unggah CV PDF agar NextRole dapat menghitung skor kecocokan di setiap lowongan."}
          </p>
        </div>

        {/* Green Vector Status Pill */}
        <div
          className={cn(
            "rounded-xl px-3.5 py-2 text-[11px] font-normal border",
            profile.cv.hasCv || selectedFile
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-slate-50 border-slate-100 text-slate-500"
          )}
        >
          {profile.cv.hasCv
            ? "Pencocokan CV aktif • Skor kecocokan tampil di setiap lowongan"
            : selectedFile
              ? "Siap diproses • Skor kecocokan akan dihitung otomatis"
              : "Pencocokan CV belum aktif • Unggah PDF untuk mulai melihat skor"}
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-12 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="col-span-4 h-11 rounded-2xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition cursor-pointer disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveUpload}
            disabled={uploading}
            className="col-span-8 h-11 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium shadow-sm transition cursor-pointer disabled:opacity-60"
          >
            {uploading
              ? "Menyimpan & Menganalisis CV..."
              : selectedFile
                ? "Simpan & Perbarui"
                : "Pilih File PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
