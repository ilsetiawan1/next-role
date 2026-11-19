# Technical Specifications Document (TSD) — NextRole

> **Status:** Approved / Engineering Architecture  
> **Versi:** 1.2.0  
> **Target Platform:** Web (Full-Stack Next.js)  
> **Arsitektur:** Frontend (FDA) • Backend (Modular Layered Repository Pattern)

---

## 1. Arsitektur Sistem & Tech Stack

Sistem dibangun menggunakan arsitektur monolit modern modular yang siap di-deploy secara serverless tanpa biaya hosting ($0).

* **Framework Inti:** Next.js (App Router, React 19, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React, DnD-Kit (untuk drag-and-drop Kanban)
* **Backend API:** Next.js Route Handlers (`src/app/api/...`)
* **Autentikasi:** Auth.js (NextAuth.js v5) dengan **Google OAuth** & Credentials (1-Click Login tanpa ribet)
* **ORM & Database:** Prisma ORM v6+ dengan PostgreSQL + ekstensi **`pgvector`** di **Neon Serverless** (koneksi via Neon Connection Pooler port 6543)
* **Penyimpanan File (Object Storage):** **Cloudflare R2** (`Standard`, Private Bucket 10 GB Free Tier) via `@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner` untuk menyimpan file PDF CV pengguna & menerbitkan *Presigned URL* preview aman berdurasi singkat
* **Mesin AI & Ekstraksi:** Vercel AI SDK (`ai`), `@ai-sdk/google` (**`gemini-3.5-flash-lite`** untuk ekstraksi terstruktur & draf follow-up, serta **`gemini-embedding-2`** dengan `outputDimensionality: 768` untuk pencocokan semantik CV vs JD), dan `zod`
* **Penjadwalan Otomatis:** Vercel Cron Jobs / Upstash QStash (Daily H+7 Check)
* **Infrastruktur Hosting:** Vercel Singapore (`sin1`) + Cloudflare (DNS & R2)

---

## 2. Struktur Folder & Organisasi Kode

### A. Frontend: Feature-Driven Architecture (FDA)
```text
src/
├── components/ui/             # Komponen atomik bersama (Button, Input, Modal, Badge)
├── features/
│   ├── auth/                  # Fitur Autentikasi (Halaman Login, Register, User Menu)
│   │   ├── components/        # LoginForm.tsx, RegisterForm.tsx
│   │   ├── api/               # authApi.ts
│   │   └── types/             # auth.types.ts
│   │
│   ├── clipper/               # Fitur Smart Job Clipper (Modal input screenshot, teks, link)
│   │   ├── components/        # ClipperModal.tsx, ScreenshotUpload.tsx, RawTextForm.tsx, QuotaBadge.tsx
│   │   ├── api/               # clipperApi.ts (panggil endpoint parser AI multimodal)
│   │   └── types/             # clipper.types.ts
│   │
│   ├── kanban/                # Fitur Papan Visual Kanban (5 Kolom Langsung: Applied s/d Rejected)
│   │   ├── components/        # KanbanBoard.tsx, KanbanColumn.tsx, ApplicationCard.tsx
│   │   ├── hooks/             # useKanbanDnD.ts (logika geser kartu)
│   │   └── types/             # kanban.types.ts
│   │
│   ├── application-detail/    # Fitur Detail Lamaran, Arsip JD, & Skor Kecocokan CV
│   │   ├── components/        # DetailDrawer.tsx, JdSnapshotView.tsx, FollowUpGenerator.tsx, MatchScorePill.tsx
│   │   └── hooks/             # useFollowUp.ts
│   │
│   ├── profile/               # Fitur Profile, Kuota AI, & Kelola PDF CV (Cloudflare R2)
│   │   ├── components/        # ProfileView.tsx, CvProfileModal.tsx, CvPdfPreviewModal.tsx
│   │   ├── api/               # profileApi.ts
│   │   └── types/             # profile.types.ts
│   │
│   └── analytics/             # Fitur Metrik Ringkasan (Response rate, total lamaran)
│       └── components/        # StatsOverview.tsx
└── app/                       # App Router Pages & Layout
```

### B. Backend: Modular Layered Architecture dengan Repository Pattern
```text
src/
├── config/                    # Inisialisasi Prisma Client (Singleton), Google AI SDK, Cloudflare R2 Client (r2.ts)
├── constants/                 # Enum status lamaran & konstanta kuota harian (MAX_DAILY_AI_CLIPS = 20)
├── middlewares/               # Error handler, rate limit guard, & input sanitizer
├── utils/                     # Helper murni (tanggal, SHA-256 hash, formatter tanpa RegEx)
└── modules/
    ├── auth/                  # Modul Autentikasi (Register, Login, Session)
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   └── auth.routes.ts
    │
    ├── profile/               # Modul CV PDF (R2 Private Bucket + Presigned URL) & CV Embedding (768d)
    │   ├── profile.controller.ts  # Validasi file PDF (maks 5 MB) & session user
    │   ├── profile.service.ts     # Upload/hapus objek R2, cek cvHash SHA-256, panggil Gemini Embedding 2
    │   ├── profile.repository.ts  # Simpan cvFileKey, cvText, cvHash, & cvEmbedding via parameterized SQL
    │   └── profile.routes.ts
    │
    ├── job-parser/            # Modul Ekstraksi AI via Vercel AI SDK (Gemini 3.5 Flash Lite)
    │   ├── job-parser.controller.ts  # Validasi payload & cek kuota harian pengguna (20/hari)
    │   ├── job-parser.service.ts     # Cek cache SHA-256, generateObject responseSchema + retry Zod maks 1-2x
    │   ├── job-parser.repository.ts  # Query & simpan JobParseCache (deduplikasi input)
    │   └── job-parser.routes.ts
    │
    ├── applications/          # Modul CRUD, JD Embedding (768d), & Match Score (pgvector)
    │   ├── applications.controller.ts
    │   ├── applications.service.ts    # Filter soft-delete, transisi status, generate jdEmbedding saat simpan
    │   ├── applications.repository.ts # Prisma queries + pgvector <=> cosine similarity (0 token AI)
    │   └── applications.routes.ts
    │
    └── follow-up/             # Modul Scheduler & Template Follow-Up (Gemini 3.5 Flash Lite)
        ├── follow-up.service.ts       # Generate pesan ramah ID/EN & cek H+7
        └── follow-up.routes.ts
```

---

## 3. Skema Database (Prisma Data Model)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Neon Pooled Connection String (Port 6543)
  directUrl = env("DIRECT_URL")        // Direct Connection String (Migrations)
}

generator client {
  provider = "prisma-client-js"
}

enum ApplicationStatus {
  APPLIED
  FOLLOW_UP_NEEDED
  INTERVIEW_SCHEDULED
  OFFERED
  REJECTED
  GHOSTED
}

model User {
  id                String        @id @default(uuid())
  name              String?
  email             String        @unique
  emailVerified     DateTime?     @map("email_verified")
  image             String?
  passwordHash      String?       @map("password_hash") // Optional jika login via Google

  // Proteksi Kuota Ekstraksi AI Harian (20 Klip/Hari)
  dailyAiClipsCount Int           @default(0) @map("daily_ai_clips_count")
  lastClipResetAt   DateTime      @default(now()) @map("last_clip_reset_at")

  // Profil CV (PDF di Cloudflare R2 Private Bucket + Teks & Vektor 768d di Neon pgvector)
  cvFileKey         String?                              @map("cv_file_key")
  cvFileName        String?                              @map("cv_file_name")
  cvText            String?       @db.Text               @map("cv_text")
  cvHash            String?                              @map("cv_hash")
  cvEmbedding       Unsupported("vector(768)")?          @map("cv_embedding")
  cvUpdatedAt       DateTime?                            @map("cv_updated_at")

  accounts          Account[]
  sessions          Session[]
  applications      Application[]

  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")

  @@map("users")
}

model Account {
  id                String  @id @default(uuid())
  userId            String  @map("user_id")
  type              String
  provider          String  // "google"
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Application {
  id              String            @id @default(uuid())
  userId          String            @map("user_id")
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName     String            @map("company_name")
  position        String
  location        String?
  employmentType  String?           @map("employment_type") // Full-time, Hybrid, Remote
  salaryRange     String?           @map("salary_range")
  jobSource       String?           @map("job_source")      // LinkedIn, JobStreet, Glints, Direct (Opsional)
  jobUrl          String?           @map("job_url")         // Tautan asli lowongan (Opsional)
  keyRequirements String[]          @default([]) @map("key_requirements")
  
  // Fitur Krusial: Arsip Permanen Teks Iklan Lowongan & Vektor Semantik (768d)
  jdSnapshot      String?                      @db.Text @map("jd_snapshot")
  jdEmbedding     Unsupported("vector(768)")?           @map("jd_embedding")
  
  // Status & Jadwal Alur
  status          ApplicationStatus @default(APPLIED)
  appliedAt       DateTime          @default(now()) @map("applied_at")
  followUpAt      DateTime?         @map("follow_up_at")
  interviewAt     DateTime?         @map("interview_at")
  
  // Kontak Recruiter
  recruiterName   String?           @map("recruiter_name")
  recruiterContact String?          @map("recruiter_contact") // Email / LinkedIn URL
  
  // Relasi Log Aktivitas
  activities      ActivityLog[]

  // Proteksi Soft Delete (Standar Enterprise)
  deletedAt       DateTime?         @map("deleted_at")
  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime          @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@index([appliedAt])
  @@index([deletedAt])
  @@map("applications")
}

model ActivityLog {
  id            String      @id @default(uuid())
  applicationId String      @map("application_id")
  actionType    String      @map("action_type") // APPLIED, FOLLOW_UP_SENT, STATUS_MOVED
  notes         String?     @db.Text
  createdAt     DateTime    @default(now()) @map("created_at")

  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@index([applicationId])
  @@map("activity_logs")
}

model JobParseCache {
  id            String   @id @default(uuid())
  contentHash   String   @unique @map("content_hash") // SHA-256 input teks/URL/file
  inputType     String   @map("input_type")           // text | url | image | pdf
  parsedPayload Json     @map("parsed_payload")
  modelVersion  String   @map("model_version")        // gemini-3.5-flash-lite
  createdAt     DateTime @default(now()) @map("created_at")

  @@map("job_parse_cache")
}
```
> *Catatan Migrasi `pgvector`:* Pastikan `CREATE EXTENSION IF NOT EXISTS vector;` dijalankan pada migrasi awal PostgreSQL Neon, dan operasi baca/tulis kolom `vector(768)` dijalankan lewat parameterized query Prisma (`$executeRaw` / `$queryRaw`) agar aman dari SQL injection.

---

## 4. Spesifikasi Kontrak API (Endpoints)

### 1. Ekstraksi AI Multimodal (Teks, URL, Screenshot, atau PDF Loker)
* **Endpoint:** `POST /api/v1/parser/extract`
* **Proteksi Kuota & Cache:** Maksimal 20 ekstraksi baru/hari per akun pengguna terautentikasi. Input di-hash SHA-256 dan dicek pada `JobParseCache` terlebih dahulu; jika *cache hit*, hasil JSON dikembalikan tanpa memanggil Gemini dan tanpa mengurangi kuota harian.
* **Request Body (Dua Pilihan Payload):**
  * **Opsi A: Raw Text / URL**
    ```json
    { "type": "text", "content": "Teks lowongan kerja dari LinkedIn..." }
    ```
  * **Opsi B: Screenshot Gambar / Dokumen PDF (Multimodal)**
    ```json
    { "type": "image", "imageBase64": "data:image/png;base64,iVBOR...", "mimeType": "image/png" }
    ```
* **Response 200 OK (Structured Output dari Gemini 3.5 Flash Lite via Zod + Retry Guard):**
  ```json
  {
    "success": true,
    "data": {
      "companyName": "PT Telkom Digital",
      "position": "Frontend Engineer",
      "location": "Jakarta / Hybrid",
      "employmentType": "Full-time",
      "salaryRange": "Rp 18.000.000 - 25.000.000",
      "jobSource": "LinkedIn",
      "jobUrl": "https://www.linkedin.com/jobs/view/...",
      "keyRequirements": ["Next.js", "TypeScript", "Tailwind"],
      "jdSnapshot": "Ringkasan lengkap tanggung jawab dan kualifikasi lowongan..."
    },
    "meta": {
      "dailyAiClipsCount": 1,
      "maxDailyAiClips": 20,
      "remainingClipsToday": 19
    }
  }
  ```
* **Response 429 Too Many Requests (Bila Melebihi Kuota Harian):**
  ```json
  {
    "success": false,
    "error": "Batas ekstraksi AI harian (20/20) telah tercapai. Kuota direset pukul 00:00 WIB. Anda tetap dapat mencatat lamaran manual tanpa batas."
  }
  ```

### 2. CRUD Lamaran & Skor Kecocokan Semantik (`pgvector`)
* `GET /api/v1/applications` $\rightarrow$ Mengambil semua lamaran aktif (`WHERE deleted_at IS NULL`) beserta `matchScore` (0–100 atau `null` jika CV belum diunggah) yang dihitung lokal di PostgreSQL via `1 - (a.jd_embedding <=> u.cv_embedding)` tanpa memanggil Gemini API.
* `POST /api/v1/applications` $\rightarrow$ Membuat lamaran baru langsung ke status `APPLIED`, sekaligus men-generate vektor `jdEmbedding` (`Gemini Embedding 2`, `768d`) 1x dari ringkasan posisi, `keyRequirements`, dan `jdSnapshot`.
* `PATCH /api/v1/applications/:id/status` $\rightarrow$ Memperbarui status kolom Kanban saat kartu digeser (`APPLIED` $\rightarrow$ `FOLLOW_UP_NEEDED` $\rightarrow$ `INTERVIEW_SCHEDULED` $\rightarrow$ `OFFERED` $\rightarrow$ `REJECTED/GHOSTED`).
* `DELETE /api/v1/applications/:id` $\rightarrow$ Soft delete (mengisi `deleted_at = NOW()`).

### 3. Generator Pesan Follow-Up
* **Endpoint:** `POST /api/v1/follow-up/generate`
* **Request Body:** `{ "applicationId": "uuid..." }`
* **Response 200 OK:**
  ```json
  {
    "success": true,
    "data": {
      "messageIndonesian": "Yth. Tim Rekrutmen PT Telkom Digital...",
      "messageEnglish": "Dear Hiring Team at PT Telkom Digital..."
    }
  }
  ```

### 4. Profil CV PDF & Semantic Embedding (`Cloudflare R2` + `Gemini Embedding 2`)
* `PUT /api/v1/profile/cv` $\rightarrow$ Menerima file PDF CV (maks 5 MB) atau teks CV. File PDF diunggah ke **Private Bucket Cloudflare R2** (`cvs/{userId}/{timestamp}-{filename}`), file R2 lama dihapus jika ada, teks diekstrak dan di-hash SHA-256 (`cvHash`). Jika `cvHash` berubah, panggil `Gemini Embedding 2` (`768d`) 1x lalu simpan ke kolom `User`.
* `GET /api/v1/profile/cv/preview` $\rightarrow$ Memverifikasi `session.user.id` lalu menerbitkan **Presigned URL** sementara (berlaku 5 menit) dari Cloudflare R2 agar PDF CV dapat dibuka/di-preview langsung oleh pemiliknya.
* `DELETE /api/v1/profile/cv` $\rightarrow$ Menghapus objek PDF di Cloudflare R2 (`DeleteObject`) dan mengosongkan metadata/vektor CV pada tabel `User`.

---

## 5. Batasan Teknis & Kebijakan Rekayasa

* **Proteksi Kuota AI Harian (*Rate Limit Guard*):** Batas 20 klip ekstraksi AI baru per akun per hari dihitung di sisi server via database User (`dailyAiClipsCount`). Reset otomatis harian jika selisih waktu `lastClipResetAt` melewati tanggal kalender baru. Cache hit dari `JobParseCache` tidak memotong kuota.
* **Structured Output & Retry Guard:** Pemanggilan `Gemini 3.5 Flash Lite` wajib memakai `responseSchema` dan divalidasi ulang oleh `zod` di backend dengan maksimal 1–2 kali retry koreksi mandiri apabila format field tidak valid.
* **Arsitektur Vector 0-Token Read Path:** `Gemini Embedding 2` (`outputDimensionality: 768`) hanya dipanggil pada saat simpan/update CV (jika `cvHash` SHA-256 berubah) dan saat simpan lamaran baru (`jdEmbedding`). Seluruh pembacaan skor kecocokan dijalankan lokal di Neon PostgreSQL (`pgvector` `<=>`).
* **Keamanan File PII via Cloudflare R2:** Bucket R2 wajib bersifat **Private** (tidak membuka akses URL publik). Preview PDF CV hanya disajikan via *Presigned URL* berdurasi singkat (5 menit) setelah verifikasi kepemilikan `session.user.id`.
* **Zero RegEx Policy:** Dilarang menggunakan pola regex (`/pattern/` atau `RegExp`). Seluruh ekstraksi string wajib menggunakan metode bawaan (`.split()`, `.trim()`, `.includes()`) atau validasi skema resmi `zod`.
* **Pragmatic Engineering (`ponytail`):** Tidak membuat interface berlebih jika implementasinya hanya 1. Menjaga fungsi tetap ringkas dan langsung menyelesaikan masalah.
* **Keamanan:** Kunci rahasia AI (`GEMINI_API_KEY`), kredensial R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`), dan URL Database (`DATABASE_URL`, `DIRECT_URL`) wajib diakses via server-side environment variables, tidak boleh terekspos ke bundle browser client.

