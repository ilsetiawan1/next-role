import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout
      activePath="/terms"
      title="Terms of Service"
      updatedAt="November 2026"
      intro="Ketentuan layanan ini mengatur penggunaan aplikasi NextRole sebagai asisten pencatatan lamaran kerja, arsip deskripsi lowongan, dan pengingat tindak lanjut."
      sections={[
        {
          title: "1. Ruang Lingkup Layanan",
          body: "NextRole menyediakan papan pengelolaan lamaran, ekstraksi detail lowongan berbantuan AI (Smart Job Clipper), arsip deskripsi lowongan permanen, perhitungan skor kecocokan CV, dan draf pesan follow-up H+7.",
        },
        {
          title: "2. Kuota Penggunaan Wajar",
          body: "Setiap akun memperoleh kuota ekstraksi Smart Job Clipper harian (20 klip per hari) yang direset otomatis setiap hari UTC. Input lowongan yang identik dilayani melalui cache SHA-256 tanpa memotong kuota harian.",
        },
        {
          title: "3. Tanggung Jawab Konten Pengguna",
          body: "Kamu bertanggung jawab penuh atas dokumen CV, teks lowongan, dan pesan follow-up yang kamu simpan atau kirimkan kepada perusahaan. Pastikan setiap draf AI ditinjau ulang sebelum dikirim.",
        },
        {
          title: "4. Ketersediaan dan Pembaruan",
          body: "Kami terus meningkatkan kualitas layanan dan dapat memperbarui fitur atau ketentuan ini sewaktu-waktu. Penggunaan berkelanjutan atas layanan menandakan persetujuan terhadap ketentuan terbaru.",
        },
      ]}
    />
  );
}
