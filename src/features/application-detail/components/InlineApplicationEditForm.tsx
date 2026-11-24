"use client";

import { useState } from "react";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import { updateApplicationApi } from "../api/detailApi";

interface InlineApplicationEditFormProps {
  application: ApplicationDto;
  onSaved: (updated: ApplicationDto) => void;
  onCancel: () => void;
}

export function InlineApplicationEditForm({
  application,
  onSaved,
  onCancel,
}: InlineApplicationEditFormProps) {
  const [salaryRange, setSalaryRange] = useState(application.salaryRange ?? "");
  const [employmentType, setEmploymentType] = useState(application.employmentType ?? "");
  const [location, setLocation] = useState(application.location ?? "");
  const [jobSource, setJobSource] = useState(application.jobSource ?? "");
  const [recruiterContact, setRecruiterContact] = useState(
    application.recruiterContact ?? application.recruiterName ?? ""
  );
  const [jobUrl, setJobUrl] = useState(application.jobUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateApplicationApi(application.id, {
        salaryRange: salaryRange.trim() || null,
        employmentType: employmentType.trim() || null,
        location: location.trim() || null,
        jobSource: jobSource.trim() || null,
        recruiterContact: recruiterContact.trim() || null,
        jobUrl: jobUrl.trim() || null,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-sky-50/70 border border-sky-200/80 p-3.5 space-y-2.5 text-xs"
    >
      <p className="font-medium text-slate-900">Edit Detail Lamaran</p>
      {error ? (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-[11px] text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Rentang Gaji</label>
          <input
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            placeholder="Rp 15.000.000 - Rp 20.000.000"
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Tipe Kerja</label>
          <input
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            placeholder="Hybrid / Remote / On-Site"
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Lokasi</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Jakarta Selatan (Hybrid)"
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Sumber Lowongan</label>
          <input
            value={jobSource}
            onChange={(e) => setJobSource(e.target.value)}
            placeholder="LinkedIn / Glints / JobStreet"
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Kontak Recruiter</label>
          <input
            value={recruiterContact}
            onChange={(e) => setRecruiterContact(e.target.value)}
            placeholder="recruiter@perusahaan.id"
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Tautan Lowongan</label>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://..."
            className="w-full h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-8 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-8 px-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium transition cursor-pointer disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
