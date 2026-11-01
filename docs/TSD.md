# Technical Specifications Document (TSD) — NextRole

> **Status:** Approved / Engineering Architecture  
> **Versi:** 1.0.0  
> **Target Platform:** Web (Full-Stack Next.js)  
> **Arsitektur:** Frontend (FDA) • Backend (Modular Layered Repository Pattern)

---

## 1. Arsitektur Sistem & Tech Stack

Sistem dibangun menggunakan arsitektur monolit modern modular yang siap di-deploy secara serverless tanpa biaya hosting ($0).

* **Framework Inti:** Next.js (App Router, React 19, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React, DnD-Kit (untuk drag-and-drop Kanban)
* **Backend API:** Next.js Route Handlers (`src/app/api/...`)
* **Autentikasi:** Auth.js (NextAuth.js v5) dengan **Google OAuth** & Credentials (1-Click Login tanpa ribet)
* **ORM & Database:** Prisma ORM v6+ dengan PostgreSQL di **Neon Serverless** (koneksi via Neon Connection Pooler port 6543)
* **Mesin AI & Ekstraksi:** Vercel AI SDK (`ai`), `@ai-sdk/google` (`gemini-1.5-flash`), dan `zod`
* **Penjadwalan Otomatis:** Vercel Cron Jobs / Upstash QStash (Daily H+7 Check)
* **Infrastruktur Hosting:** Vercel (Edge/Serverless Platform) + Cloudflare (DNS)

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
│   ├── clipper/               # Fitur Smart Job Clipper (Modal input link/teks lowongan)
│   │   ├── components/        # ClipperModal.tsx, RawTextForm.tsx
│   │   ├── api/               # clipperApi.ts (panggil endpoint parser AI)
│   │   └── types/             # clipper.types.ts
│   │
│   ├── kanban/                # Fitur Papan Visual Kanban
│   │   ├── components/        # KanbanBoard.tsx, KanbanColumn.tsx, ApplicationCard.tsx
│   │   ├── hooks/             # useKanbanDnD.ts (logika geser kartu)
│   │   └── types/             # kanban.types.ts
│   │
│   ├── application-detail/    # Fitur Detail Lamaran & Arsip JD
│   │   ├── components/        # DetailDrawer.tsx, JdSnapshotView.tsx, FollowUpGenerator.tsx
│   │   └── hooks/             # useFollowUp.ts
│   │
│   └── analytics/             # Fitur Metrik Ringkasan (Response rate, total lamaran)
│       └── components/        # StatsOverview.tsx
└── app/                       # App Router Pages & Layout
```

### B. Backend: Modular Layered Architecture dengan Repository Pattern
```text
src/
├── config/                    # Inisialisasi Prisma Client (Singleton) & Google AI SDK
├── constants/                 # Enum status lamaran & konstanta waktu
├── middlewares/               # Error handler & input sanitizer
└── modules/
    ├── auth/                  # Modul Autentikasi (Register, Login, Session)
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   └── auth.routes.ts
    │
    ├── job-parser/            # Modul Ekstraksi AI via Vercel AI SDK
    │   ├── job-parser.controller.ts
    │   ├── job-parser.service.ts     # Panggil generateObject dengan skema Zod
    │   └── job-parser.routes.ts
    │
    ├── applications/          # Modul CRUD & Logika Lamaran
    │   ├── applications.controller.ts
    │   ├── applications.service.ts    # Filter soft-delete, transisi status
    │   ├── applications.repository.ts # Prisma queries murni
    │   └── applications.routes.ts
    │
    └── follow-up/             # Modul Scheduler & Template Follow-Up
        ├── follow-up.service.ts       # Generate pesan ramah & cek H+7
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
  WISHLIST
  APPLIED
  FOLLOW_UP_NEEDED
  INTERVIEW_SCHEDULED
  OFFERED
  REJECTED
  GHOSTED
}

model User {
  id            String        @id @default(uuid())
  name          String?
  email         String        @unique
  emailVerified DateTime?     @map("email_verified")
  image         String?
  passwordHash  String?       @map("password_hash") // Optional jika login via Google

  accounts      Account[]
  sessions      Session[]
  applications  Application[]

  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

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
  keyRequirements String[]          @default([]) @map("key_requirements")
  
  // Fitur Krusial: Arsip Permanen Teks Iklan Lowongan
  jdSnapshot      String?           @db.Text @map("jd_snapshot")
  
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
```

---

## 4. Spesifikasi Kontrak API (Endpoints)

### 1. Ekstraksi AI dari Teks / URL
* **Endpoint:** `POST /api/v1/parser/extract`
* **Request Body:**
  ```json
  { "rawText": "Teks lowongan kerja dari LinkedIn..." }
  ```
* **Response 200 OK (Structured Output dari Gemini 1.5 Flash via Zod):**
  ```json
  {
    "success": true,
    "data": {
      "companyName": "PT Telkom Digital",
      "position": "Frontend Engineer",
      "location": "Jakarta / Hybrid",
      "employmentType": "Full-time",
      "salaryRange": "Negotiable",
      "keyRequirements": ["Next.js", "TypeScript", "Tailwind"],
      "jdSnapshot": "Ringkasan lengkap tanggung jawab..."
    }
  }
  ```

### 2. CRUD Lamaran (Daftar & Buat)
* `GET /api/v1/applications` $\rightarrow$ Mengambil semua lamaran aktif (`WHERE deleted_at IS NULL`).
* `POST /api/v1/applications` $\rightarrow$ Membuat lamaran baru.
* `PATCH /api/v1/applications/:id/status` $\rightarrow$ Memperbarui status kolom Kanban saat kartu digeser.
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

---

## 5. Batasan Teknis & Kebijakan Rekayasa

* **Zero RegEx Policy:** Dilarang menggunakan pola regex (`/pattern/` atau `RegExp`). Seluruh ekstraksi string wajib menggunakan metode bawaan (`.split()`, `.trim()`, `.includes()`) atau validasi skema resmi `zod`.
* **Pragmatic Engineering (`ponytail`):** Tidak membuat interface berlebih jika implementasinya hanya 1. Menjaga fungsi tetap ringkas dan langsung menyelesaikan masalah.
* **Keamanan:** Kunci rahasia AI (`GEMINI_API_KEY`) dan URL Database (`DATABASE_URL`) wajib diakses via server-side environment variables, tidak boleh terekspos ke bundle browser client.

