"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ArrowUpRight, ExternalLink, FileText, LogOut, ShieldCheck, Trash2, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  formatShortDateId,
  getUserInitials,
  type ProfileDto,
} from "@/features/shared/workspace-types";
import { deleteCvApi, getCvPreviewUrlApi, uploadCvApi } from "../api/profileApi";

interface ProfileViewProps {
  initialProfile: ProfileDto;
  isGuest: boolean;
  stats: {
    totalApplied: number;
    interviews: number;
    offers: number;
    responseRate: number;
  };
}

export function ProfileView({ initialProfile, isGuest, stats }: ProfileViewProps) {
  const [profile, setProfile] = useState<ProfileDto>(initialProfile);
  const [uploading, setUploading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = getUserInitials(profile.name, profile.email);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(null);
    setUploading(true);

    try {
      const updated = await uploadCvApi(file);
      setProfile(updated);
      setMessage({
        type: "ok",
        text: updated.reembedded
          ? "CV PDF berhasil disimpan ke R2 Private Bucket & vektor kecocokan CV telah diperbarui."
          : "CV PDF berhasil diperbarui (isi teks identik, vektor tidak perlu dihitung ulang).",
      });
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal mengunggah CV PDF.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleOpenPreview() {
    setMessage(null);
    setLoadingPreview(true);
    try {
      const res = await getCvPreviewUrlApi();
      setPreviewUrl(res.url);
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal membuka pratinjau PDF.",
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleDeleteCv() {
    setMessage(null);
    setDeleting(true);
    try {
      await deleteCvApi();
      setProfile((prev) => ({
        ...prev,
        cv: { fileName: null, updatedAt: null, hasCv: false },
      }));
      setMessage({ type: "ok", text: "CV PDF berhasil dihapus dari R2 dan database." });
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Gagal menghapus CV.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola akun, kuota harian AI clipper, dan arsip CV PDF privatmu
        </p>
      </div>

      {message ? (
        <div
          role={message.type === "err" ? "alert" : "status"}
          className={
            message.type === "ok"
              ? "rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800"
              : "rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700"
          }
        >
          {message.text}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Hero + Promo Card (sesuai FigCraft Profile) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-surface rounded-[28px] overflow-hidden">
            <div className="h-28 sky-hero-gradient" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <div className="h-20 w-20 rounded-full bg-sky-100 border-4 border-white text-sky-800 text-2xl font-extrabold flex items-center justify-center shadow-md">
                  {initials}
                </div>
                <span className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  {isGuest ? "Mode Demo" : "Akun Terverifikasi"}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {profile.name ?? "Pengguna NextRole"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>

              <div className="mt-6 grid grid-cols-4 gap-2 border-t border-slate-100 pt-5 text-center">
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{stats.totalApplied}</p>
                  <p className="text-[11px] text-slate-500">Total</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0284C7]">{stats.interviews}</p>
                  <p className="text-[11px] text-slate-500">Wawancara</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-emerald-600">{stats.offers}</p>
                  <p className="text-[11px] text-slate-500">Penawaran</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{stats.responseRate}%</p>
                  <p className="text-[11px] text-slate-500">Respon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sky-hero-gradient rounded-[28px] p-6 text-white flex items-center justify-between gap-4 shadow-lg shadow-sky-700/15">
            <div>
              <h3 className="text-base font-bold leading-snug">
                Arsip Kerja Siap Saat HRD Menelepon
              </h3>
              <p className="mt-1.5 text-xs text-sky-100 leading-relaxed">
                Buka kartu lamaran kapan saja untuk baca deskripsi & gaji tanpa cari ulang link.
              </p>
              <Link
                href="/roles"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#D4FF47] text-[#0C4A6E] px-4 py-2 text-xs font-bold hover:brightness-95 transition"
              >
                Buka Papan Roles
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <Image
              src="/images/dashboard/banner-clipper-2.png"
              alt="Ilustrasi Arsip JD"
              width={110}
              height={110}
              className="hidden sm:block w-24 h-auto object-contain shrink-0"
            />
          </div>
        </div>

        {/* Right Column: Account, CV PDF Manager, Session */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Account
            </p>
            <div className="glass-surface rounded-3xl divide-y divide-slate-100">
              {/* Kuota Smart AI Clipper */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Kuota Smart AI Clipper</p>
                    <p className="text-xs text-slate-500">Reset otomatis setiap hari UTC</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#D4FF47] px-3 py-1 text-xs font-bold text-[#0C4A6E] shrink-0">
                  {profile.quota.used} / {profile.quota.limit} Klip
                </span>
              </div>

              {/* Profil CV & Skill (PDF) -> R2 Private Bucket */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Profil CV & Skill (PDF)</p>
                      <p className="text-xs text-slate-500">
                        {profile.cv.hasCv
                          ? `${profile.cv.fileName} • Diperbarui ${
                              profile.cv.updatedAt ? formatShortDateId(profile.cv.updatedAt) : "-"
                            }`
                          : "Unggah PDF (maks 5 MB) untuk mengaktifkan skor kecocokan CV otomatis."}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div className="flex flex-wrap items-center gap-2.5 pl-0 sm:pl-13">
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploading
                      ? "Mengunggah & Menghitung Vektor..."
                      : profile.cv.hasCv
                        ? "Ganti CV PDF"
                        : "Unggah CV PDF"}
                  </Button>

                  {profile.cv.hasCv ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleOpenPreview}
                        disabled={loadingPreview}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {loadingPreview ? "Membuka..." : "Pratinjau PDF"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteCv}
                        disabled={deleting}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleting ? "Menghapus..." : "Hapus CV"}
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Keamanan Akun */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Privasi & Penyimpanan CV</p>
                    <p className="text-xs text-slate-500">
                      PDF disimpan privat di Cloudflare R2 dengan Presigned URL 5 menit
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 shrink-0">Aktif</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Session
            </p>
            <div className="glass-surface rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Keluar dari Ruang Kerja</p>
                <p className="text-xs text-slate-500">
                  Akhiri sesi login perangkat ini dengan aman
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
                Keluar Akun
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pratinjau PDF via Presigned URL 5 Menit */}
      <Modal
        open={previewUrl !== null}
        onClose={() => setPreviewUrl(null)}
        title={profile.cv.fileName ?? "Pratinjau CV PDF"}
        subtitle="Tautan Presigned URL aman ini berlaku selama 5 menit."
        maxWidthClass="max-w-4xl"
      >
        {previewUrl ? (
          <div className="space-y-3">
            <iframe
              src={previewUrl}
              title="Pratinjau CV PDF"
              className="w-full h-[65dvh] rounded-2xl border border-slate-200 bg-slate-50"
            />
            <div className="flex justify-end">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:underline"
              >
                Buka di Tab Baru
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
