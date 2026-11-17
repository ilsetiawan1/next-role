# NextRole — Intelligent Job Hunt Assistant

Platform asisten pelacakan lamaran kerja untuk mengotomatisasi pencatatan lowongan berbasis AI, mengarsipkan deskripsi pekerjaan (*Job Description Snapshot*) secara utuh, memantau tindak lanjut HRD (*Follow-Up H+7*), serta mengevaluasi efektivitas pencarian karier dalam satu ruang kerja terstruktur.

---

## Ringkasan Masalah & Solusi

Proses melamar kerja sering terhambat oleh empat kendala utama:
1. **Lowongan Dihapus Sebelum Wawancara:** Iklan lowongan di portal kerja kerap ditutup ketika HRD baru menghubungi kandidat secara mendadak, sehingga pelamar kehilangan detail kualifikasi dan rentang gaji.
2. **Input Manual yang Melelahkan:** Menyalin nama perusahaan, posisi, sumber portal, dan persyaratan ke spreadsheet satu per satu menyita waktu.
3. **Sulit Menjaga Ritme Follow-Up:** Pelamar kerap lupa menindaklanjuti lamaran yang sudah melewati batas wajar tanpa respon atau bingung menyusun pesan yang tepat.
4. **Histori Statistik Rusak:** Menghapus data lamaran yang ditolak menghilangkan metrik evaluasi konversi portal dan tingkat respon perusahaan.

**NextRole** menjawab kendala tersebut melalui kapabilitas inti berikut:
* **Smart Job Clipper (Otomatis AI & Manual):** Mendukung ekstraksi terstruktur dari tautan iklan, tangkapan layar (*screenshot*), maupun teks mentah menggunakan Google Gemini 1.5 Flash, lengkap dengan pencatatan sumber portal (`jobSource`, `jobUrl`) dan penyimpanan deskripsi pekerjaan secara utuh. Mode input manual juga tersedia dengan kolom sumber bersifat opsional.
* **5-Column Kanban Pipeline:** Papan visual progres lamaran langsung tanpa daftar tunggu (*Wishlist*), meliputi `Applied`, `Follow-Up Needed`, `Interview Scheduled`, `Offered`, dan `Rejected / Ghosted`.
* **Detail Lamaran & Generator Follow-Up Dwi-Bahasa:** Drawer detail yang memuat ringkasan riwayat, arsip deskripsi pekerjaan untuk persiapan wawancara mendadak, indikator H+7, serta pembuat draf pesan follow-up ke HRD dalam Bahasa Indonesia dan Bahasa Inggris.
* **Career Analytics Dashboard:** Evaluasi data riil meliputi kecepatan respon HRD, konversi antar-tahap pipeline, rata-rata *lead time*, distribusi gaji & tipe kerja, efektivitas portal sumber, hingga daftar kualifikasi teknis yang paling sering diminta.
* **Soft-Delete Protection:** Arsip lamaran yang dihapus tetap menjaga integritas statistik dan dapat dipulihkan dari halaman Profile.
* **1-Click Guest / Demo Mode:** Opsi uji coba instan di halaman autentikasi berdampingan dengan login Google OAuth.

---

## Struktur Modul & Navigasi Aplikasi

### Antarmuka Pengguna (Desktop 1440px, Tablet 834px, Mobile 390px)
* **Home:** Ringkasan harian, *search & quick filter*, daftar lamaran yang memerlukan tindak lanjut H+7, status pipeline terkini, statistik ringkas, serta kalender agenda.
* **Roles:** Papan Kanban interaktif 5 kolom dengan pembaruan status *drag-and-drop* dan akses cepat ke drawer detail lamaran.
* **Analytics:** Evaluasi performa pencarian kerja (*Kecepatan Respon HRD*, *Konversi Pipeline*, *Lead Time Tahapan*, *Preferensi & Gaji*, *Efektivitas Portal Sumber*, dan *Kualifikasi Diminta*).
* **Profile:** Kartu identitas pengguna dengan statistik karier ringkas (`Total Lamaran`, `Wawancara`, `Penawaran`, `Tingkat Respon`) serta pengelompokan menu **Account** (kuota AI Clipper 20 klip/hari, koneksi Google), **Preferences** (toggle pengingat H+7, bahasa draf pesan), **Data & Privacy** (ekspor CSV/JSON, pemulihan arsip), dan **Session**.

### Bahasa Visual (*Soft Sky Glass*)
* **Palet Warna:** Latar gradien biru langit lembut (`#F4F9FF` ke `#E3F1FD`), permukaan kartu kaca putih semi-transparan (`#FFFFFFE0`), aksen utama biru (`#0284C7` / `#0369A1`), serta sorotan fungsional kuning neon (`#D4FF47`) pada CTA utama dan indikator kuota.
* **Tipografi:** `Poppins` dan `Plus Jakarta Sans` dengan bobot ringan (`Regular` dan `Medium`) tanpa penggunaan `Bold` berlebih.

---

## Arsitektur Sistem

NextRole dirancang menggunakan arsitektur monolit modular dengan pemisahan tanggung jawab yang jelas antara lapisan antarmuka dan layanan backend.

### 1. Frontend: Feature-Driven Architecture (FDA)
```text
src/
├── components/ui/             # Komponen atomik bersama (Button, Input, Modal, Drawer, Badge)
├── features/
│   ├── auth/                  # Autentikasi (Google OAuth & Guest Demo Session)
│   ├── clipper/               # Modal Smart Job Clipper (AI Extract Link/Gambar & Input Manual)
│   ├── kanban/                # Papan visual Kanban 5 kolom drag-and-drop (DnD-Kit)
│   ├── application-detail/    # Drawer detail, arsip deskripsi pekerjaan, & follow-up generator
│   └── analytics/             # Visualisasi metrik performa karier
└── app/                       # Next.js App Router (Pages, Layouts, API Route Handlers)
```

### 2. Backend: Modular Layered Architecture & Repository Pattern
```text
src/
├── config/                    # Singleton Prisma Client & klien Google AI SDK
├── constants/                 # Enum ApplicationStatus & pesan standar
├── middlewares/               # Auth guard, error handler, input sanitizer
├── utils/                     # Fungsi helper murni (tanggal & formatter)
└── modules/
    ├── auth/                  # Manajemen sesi akun & Guest Mode
    ├── job-parser/            # Ekstraksi lowongan via Gemini 1.5 Flash
    ├── applications/          # CRUD lamaran, transisi status, soft delete (deletedAt IS NULL)
    └── follow-up/             # Perhitungan H+7 & generator draf pesan dwi-bahasa
        ├── <modul>.routes.ts
        ├── <modul>.controller.ts
        ├── <modul>.service.ts
        ├── <modul>.repository.ts
        ├── <modul>.openapi.ts
        └── __tests__/
```

* **Aliran Eksekusi Data:** `Client Request -> Routes -> Controller -> Service -> Repository -> Prisma / PostgreSQL`.
* **Dokumentasi API Terintegrasi:** Setiap modul menyertakan kontrak OpenAPI kolokasi (`<modul>.openapi.ts`) yang disajikan secara interaktif melalui Scalar di endpoint `/docs`.

---

## Tech Stack

* **Framework:** Next.js (App Router, React 19, TypeScript)
* **Styling & Interaksi:** Tailwind CSS, Lucide Icons, DnD-Kit
* **Autentikasi:** Auth.js (NextAuth v5) — Google OAuth & Guest Session
* **Database & ORM:** PostgreSQL (Neon Serverless) melalui Prisma ORM v6+ (koneksi *pooled* port `6543`)
* **Mesin AI:** Google Gemini 1.5 Flash melalui Vercel AI SDK (`ai` & `@ai-sdk/google`)
* **Dokumentasi API:** Scalar API Reference (`@scalar/nextjs-api-reference`)
* **Deployment:** Vercel
* **Desain Kanvas:** FigCraft

---

## Standar Rekayasa & Keamanan

1. **Zero RegEx Policy:** Seluruh logika validasi dan pengolahan string dilarang menggunakan Regular Expression (`RegExp` / `/pattern/`) untuk mencegah kerentanan ReDoS dan menjaga keterbacaan kode. Validasi format memanfaatkan `zod` dan parser standar (`new URL()`), sedangkan pengolahan teks memakai metode native string (`.includes()`, `.startsWith()`, `.split()`, `.trim()`).
2. **Strict Ownership Guard:** Validasi kepemilikan data (`userId`) dan penyaringan arsip terhapus (`deletedAt IS NULL`) ditegakkan di lapisan Service dan Repository.
3. **Pragmatic Engineering:** Menghindari abstraksi dan wrapper berlebihan di luar kebutuhan nyata.
4. **Proteksi Kredensial:** Kunci sensitif (`DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`) hanya dibaca pada lingkungan server.

---

## Dokumen Spesifikasi & Status Pengembangan

Seluruh cetak biru produk dan desain tersimpan di direktori [docs](docs):
* [Product Requirements Document (PRD)](docs/PRD.md)
* [Technical Specification Document (TSD)](docs/TSD.md)
* [UI/UX Design Guide](docs/DESIGN.md)
* [Execution Roadmap (5 Sprint)](docs/ROADMAP.md)
* [Agent & Engineering Rules](AGENTS.md)

**Status Saat Ini:** Penyelesaian desain antarmuka *multi-device* (Mobile, Tablet, Desktop) pada [docs/next-role.figcraft](docs/next-role.figcraft) serta sinkronisasi dokumen spesifikasi (**Sprint 1**) sebelum masuk ke tahap inisialisasi proyek Next.js dan implementasi backend (**Sprint 2–5**).

---

## Persiapan Lingkungan Lokal (Tahap Implementasi)

```bash
git clone https://github.com/ilsetiawan1/next-role.git
cd next-role
```

Konfigurasi variabel `.env` saat inisialisasi aplikasi Next.js di Sprint 2:

```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.region.aws.neon.tech/nextrole?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-sample.region.aws.neon.tech/nextrole?sslmode=require"

AUTH_SECRET="your-super-secret-key-min-32-chars"
AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GEMINI_API_KEY="your-google-gemini-api-key"
```

---

## Standar Git Workflow

* **Branch Utama:** Dilarang melakukan commit langsung ke `main`.
* **Isolasi Perubahan:** Gunakan penamaan branch terpisah sesuai konteks (`feat/<fitur>`, `fix/<bug>`, `refactor/<modul>`).
* **Conventional Commits:** Gunakan awalan standar (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`).

---

## Lisensi

Proyek ini dikembangkan untuk keperluan portofolio profesional dan penggunaan personal.
