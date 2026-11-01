# NextRole — Intelligent Job Hunt Assistant

> **Platform Asisten Karir Cerdas:** Otomatisasi pelacakan lamaran kerja, pengarsipan permanen persyaratan lowongan (*JD Snapshot*), etika *follow-up* HRD cerdas (H+7), dan persiapan interview berbasis AI.

---

## 📌 Gambaran Umum (Overview)

Mencari pekerjaan sering kali menjadi pengalaman yang melelahkan dan kacau:
1. **Kehilangan Deskripsi Pekerjaan (*Ghosted Job Postings*):** Lowongan di LinkedIn/Glints dihapus sebelum pelamar sempat membaca ulang kualifikasi untuk persiapan wawancara.
2. **Kelelahan Input Manual:** Menulis detail perusahaan ke spreadsheet satu per satu menghabiskan waktu dan energi.
3. **Canggung Follow-Up:** Bingung menyusun kata-kata sopan saat follow-up ke HRD setelah seminggu tanpa kabar.
4. **Data Terhapus Permanen:** Menghapus kartu lamaran yang ditolak merusak histori statistik evaluasi pencarian kerja.

**NextRole** hadir menyelesaikan masalah tersebut dengan pendekatan cerdas, bersih, dan terstruktur:
* **Smart Job Clipper (URL & Raw Text):** Cukup tempel tautan atau teks iklan lowongan kerja, AI (*Google Gemini 1.5 Flash*) otomatis mengekstrak posisi, nama perusahaan, kualifikasi kunci, dan mengarsipkan deskripsi pekerjaan secara permanen (*Permanent JD Snapshot*).
* **Interactive 6-Column Kanban Pipeline:** Papan alur lamaran visual dengan 6 status: `Wishlist`, `Applied`, `Follow-Up Needed`, `Interview Scheduled`, `Offered`, dan `Rejected / Ghosted`.
* **Smart Follow-Up Engine (H+7):** Peringatan otomatis saat lamaran mencapai hari ke-7 tanpa kabar, lengkap dengan generator draf pesan tindak lanjut profesional dalam Bahasa Indonesia & Bahasa Inggris.
* **Soft-Delete Protection:** Menghapus lamaran tanpa merusak riwayat statistik (*audit trail* aman).
* **1-Click Guest / Demo Mode:** Akses instan bagi peninjau atau pengguna baru tanpa kewajiban mendaftar terlebih dahulu.

---

## 🏛️ Fondasi Arsitektur Sistem

NextRole dibangun dengan standar arsitektur monolit modern yang modular, aman, dan siap produksi:

### 1. Frontend: Feature-Driven Architecture (FDA)
Seluruh kode antarmuka dikelompokkan berdasarkan **domain fitur bisnis**, bukan tipe file teknis:
```text
src/
├── components/ui/             # Komponen atomik bersama (Button, Input, Modal, Drawer, Badge)
├── features/
│   ├── auth/                  # Autentikasi (Google OAuth, 1-Click Guest Mode)
│   ├── clipper/               # Smart Job Clipper (Modal input link/teks & ekstraksi AI)
│   ├── kanban/                # Papan visual 6 kolom drag-and-drop (DnD-Kit)
│   ├── application-detail/    # Drawer detail, arsip JD Snapshot, & follow-up generator
│   └── analytics/             # Kartu metrik statistik lamaran
└── app/                       # Next.js App Router (Halaman & Layouts)
```

### 2. Backend: Modular Layered Architecture dengan Repository Pattern
Setiap modul domain backend berdiri mandiri (*vertical slice*) dengan pemisahan aliran data 4 lapis yang ketat:
```text
src/
├── config/                    # Inisialisasi Prisma Client (db.ts) & Google AI SDK
├── constants/                 # Enum ApplicationStatus & pesan baku
├── middlewares/               # Auth guard, error handling, input sanitization
└── modules/
    ├── auth/                  # Modul login, sesi, dan akun tamu
    ├── job-parser/            # Ekstraksi lowongan via Gemini 1.5 Flash (Vercel AI SDK)
    ├── applications/          # CRUD lamaran, transisi status kanban, soft delete
    └── follow-up/             # Hitung waktu H+7 & draf pesan tindak lanjut
        ├── <modul>.routes.ts       # Definisi endpoint & metode HTTP
        ├── <modul>.controller.ts   # Handler request/response & validasi Zod
        ├── <modul>.service.ts      # Logika bisnis & aturan domain
        ├── <modul>.repository.ts   # Interaksi langsung Prisma ORM
        ├── <modul>.openapi.ts      # Kontrak dokumentasi OpenAPI (Colocated)
        └── __tests__/              # Unit & integration test khusus modul
```

* **Aliran Data Baku:**  
  `Client Request` $\longrightarrow$ `Routes` $\longrightarrow$ `Controller` $\longrightarrow$ `Service` $\longrightarrow$ `Repository` $\longrightarrow$ `Database (Prisma/Neon)`.
* **Scalar API Documentation:** Seluruh endpoint terdokumentasi secara interaktif di rute `/docs`.

---

## 🛠️ Tech Stack & Infrastruktur ($0 Cost Tier)

* **Framework Inti:** Next.js (App Router, React 19, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React, DnD-Kit
* **Autentikasi:** Auth.js (NextAuth v5) dengan Google OAuth + 1-Click Demo Mode
* **Database & ORM:** PostgreSQL di Neon Serverless via Prisma ORM v6+ (Koneksi pooled port 6543)
* **Mesin AI:** Google Gemini 1.5 Flash via Vercel AI SDK (`ai` & `@ai-sdk/google`)
* **Dokumentasi API:** Scalar API Reference (`@scalar/nextjs-api-reference`)
* **Hosting:** Vercel (Edge/Serverless Platform)

---

## 🔒 Kebijakan Kualitas & Keamanan Baku

1. **Zero RegEx Policy:**  
   Dilarang keras menulis atau menerapkan Regular Expression (`RegExp` / `/pattern/`). Seluruh manipulasi string menggunakan metode bawaan (`.includes()`, `.startsWith()`, `.split()`), dan validasi format menggunakan parser resmi (`zod`, `new URL()`) untuk mengeliminasi risiko ReDoS (*Regular Expression Denial of Service*).
2. **Anti-AI Slop UI/UX:**  
   Bebas dari badge capsule warna-warni berlebih (*pill-soup*). Menggunakan indikator titik 6px minimalis, tipografi tegas (*Plus Jakarta Sans* untuk branding, *Inter* untuk antarmuka), dan rasio kontras $\ge 4.5:1$.
3. **Anti-Overengineering (`ponytail`):**  
   Prinsip *pragmatic senior dev* — tidak membuat lapisan interface kosong jika implementasinya tunggal. Menulis kode yang ringkas dan langsung menyelesaikan masalah.
4. **Keamanan Produksi (`security-audit`):**  
   Seluruh kredensial rahasia (`DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`) hanya diakses di sisi server. Otorisasi kepemilikan data (`userId`) divalidasi ketat di layer Service.

---

## 🗺️ Roadmap Pelaksanaan (5 Sprint Terukur)

Lihat detail lengkap tiket dan acceptance criteria di [docs/ROADMAP.md](file:///e:/project-nextjs/next-role/docs/ROADMAP.md).

* **Sprint 1: Perancangan UI/UX di FigCraft (Canvas Visual)**
  * *Catatan:* Pengguna membuka aplikasi FigCraft manual terlebih dahulu di `localhost:7979`.
  * Tiket 1.1: Layar Utama Kanban Board (6 Kolom sesuai TSD) & Kartu Metrik Ringkasan.
  * Tiket 1.2: Modal Smart Job Clipper (Input Link & Teks Iklan Lowongan).
  * Tiket 1.3: Detail Drawer (Tab Ringkasan, Tab Arsip JD Snapshot, Generator Follow-Up).
  * Tiket 1.4: Halaman Login & Tombol 1-Click "Explore as Guest / Mode Demo".
* **Sprint 2: Inisialisasi Proyek, Dependensi & Setup Struktur Folder**
  * Setup Next.js, Tailwind, Prisma ORM, Vercel AI SDK, struktur FDA & Backend Modular.
  * Sinkronisasi repository GitHub (`https://github.com/ilsetiawan1/next-role.git`).
* **Sprint 3: Backend Core Engine & Dokumentasi API Scalar (API-First)**
  * Migrasi database PostgreSQL Neon, implementasi 4 modul domain, viewer `/docs` via Scalar.
* **Sprint 4: Frontend Development & Integrasi UI/UX (FDA)**
  * Konversi rancangan FigCraft ke komponen FDA, drag-and-drop Kanban, dan integrasi API.
* **Sprint 5: Demo Mode Seeding, Polishing & Deployment Vercel**
  * Seeder 6 kartu data realistis, audit keamanan akhir Zero RegEx, deployment ke Vercel.

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Kloning Repository
```bash
git clone https://github.com/ilsetiawan1/next-role.git
cd next-role
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root direktori proyek:
```env
# Database Neon (PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/nextrole?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/nextrole?sslmode=require"

# Auth.js / NextAuth v5
AUTH_SECRET="your-super-secret-key-min-32-chars"
AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI SDK
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Instalasi Dependensi & Migrasi Database
```bash
npm install
npx prisma db push
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000` untuk aplikasi dan `http://localhost:3000/docs` untuk dokumentasi API Scalar.

---

## 🌿 Standar Kontribusi & Git Branching

* **Larangan Commit Langsung ke `main`:** Seluruh pengerjaan fitur wajib melalui branch terisolasi.
* **Format Penamaan Branch:**
  * Fitur baru: `feat/<nama-fitur>`
  * Perbaikan bug: `fix/<nama-bug>`
  * Refaktorisasi: `refactor/<nama-modul>`
* **Konvensi Pesan Commit:** Mengikuti format [Conventional Commits](https://www.conventionalcommits.org/):
  * `feat: add smart job clipper modal with raw text parsing`
  * `fix: correct H+7 date calculation in follow-up service`
  * `docs: update roadmap and technical specs for sprint 1`

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi terbuka untuk keperluan pengembangan profesional, personal, maupun portofolio.
