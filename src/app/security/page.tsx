import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Security",
  description: "Standar keamanan data, enkripsi, dan privasi dokumen CV di NextRole.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <LegalDocumentLayout
      activePath="/security"
      title="Security"
      updatedAt="November 2026"
      intro="Keamanan data pencarian kerjamu adalah prioritas utama NextRole. Halaman ini merangkum perlindungan teknis yang kami terapkan pada setiap lapisan aplikasi."
      sections={[
        {
          title: "1. Isolasi Kepemilikan Data",
          body: "Setiap permintaan API yang mengakses lamaran, profil, atau dokumen CV selalu memverifikasi sesi Auth.js di sisi server dan membatasi kueri berdasarkan kepemilikan userId secara ketat.",
        },
        {
          title: "2. Proteksi Dokumen CV di Private Bucket",
          body: "File PDF CV tidak pernah ditempatkan di URL publik. Dokumen disimpan di Cloudflare R2 Private Bucket dan hanya dapat diakses melalui Presigned URL berumur singkat (5 menit) setelah verifikasi akun.",
        },
        {
          title: "3. Validasi Input dan Proteksi API",
          body: "Seluruh payload request divalidasi dengan skema Zod ketat, kata sandi di-hash menggunakan scrypt dengan salt acak, dan seluruh kredensial layanan eksternal hanya disimpan di environment server.",
        },
        {
          title: "4. Pelaporan Celah Keamanan",
          body: "Jika kamu menemukan potensi celah keamanan pada layanan NextRole, segera hubungi tim pengembang melalui repositori resmi agar dapat segera ditangani sebelum dipublikasikan.",
        },
      ]}
    />
  );
}
