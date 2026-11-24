import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      activePath="/privacy"
      title="Privacy Policy"
      updatedAt="November 2026"
      intro="Kebijakan ini menjelaskan bagaimana NextRole mengumpulkan, menyimpan, dan melindungi data akun, riwayat lamaran, serta dokumen CV yang kamu kelola di layanan kami."
      sections={[
        {
          title: "1. Data Akun dan Autentikasi",
          body: "Saat kamu masuk menggunakan Google OAuth atau email, NextRole hanya menyimpan nama, alamat email, dan penanda sesi akun. Informasi ini digunakan semata-mata untuk mengidentifikasi akun dan mengisolasi ruang kerjamu.",
        },
        {
          title: "2. Penyimpanan Privat Dokumen CV",
          body: "File PDF CV yang diunggah disimpan dalam penyimpanan privat tanpa akses publik. Pratinjau dokumen hanya dibuka melalui tautan sementara terenkripsi (Presigned URL 5 menit) setelah sistem memverifikasi kepemilikan sesimu.",
        },
        {
          title: "3. Pemrosesan Kecocokan Profil",
          body: "Isi teks CV dan deskripsi lowongan diproses untuk menghitung skor relevansi secara otomatis di ruang kerjamu. Data dokumen pribadimu tidak pernah dijual, dibagikan ke pihak ketiga, atau dipakai untuk iklan.",
        },
        {
          title: "4. Kendali Data dan Mode Demo",
          body: "Kamu berhak memperbarui file CV atau menghapus data lamaran kapan saja melalui halaman Profil. Seluruh data yang dibuat pada Mode Demo 1-Klik bersifat sementara dan terisolasi per sesi.",
        },
      ]}
    />
  );
}
