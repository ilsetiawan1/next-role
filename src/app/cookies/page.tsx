import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/layout/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Kebijakan cookie esensial untuk autentikasi dan keamanan sesi di NextRole.",
  alternates: { canonical: "/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <LegalDocumentLayout
      activePath="/cookies"
      title="Cookie Policy"
      updatedAt="November 2026"
      intro="NextRole hanya menggunakan cookie esensial yang diperlukan agar autentikasi dan ruang kerjamu berjalan aman tanpa pelacakan iklan lintas situs."
      sections={[
        {
          title: "1. Cookie Sesi Autentikasi",
          body: "Auth.js menyimpan token sesi terenkripsi dalam cookie HTTP-only agar kamu tetap masuk secara aman saat berpindah antar halaman Home, Roles, Analytics, dan Profile.",
        },
        {
          title: "2. Cookie Proteksi CSRF",
          body: "Kami menggunakan cookie token anti-CSRF bawaan untuk melindungi proses masuk, pendaftaran, dan keluar akun dari permintaan lintas situs yang tidak sah.",
        },
        {
          title: "3. Tanpa Cookie Iklan Pihak Ketiga",
          body: "NextRole tidak memasang cookie pelacak periklanan pihak ketiga atau menjual histori penjelajahanmu ke jaringan iklan mana pun.",
        },
        {
          title: "4. Mengelola Cookie di Browser",
          body: "Kamu dapat menghapus atau memblokir cookie melalui pengaturan browser kapan saja. Namun menonaktifkan cookie esensial dapat membuat fitur login dan ruang kerja tidak dapat digunakan.",
        },
      ]}
    />
  );
}
