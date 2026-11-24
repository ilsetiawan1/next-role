# Implementation Plan — Project Scaffold & Core Setup (Sprint 2)

> **Branch:** `feat/project-scaffold-setup`
> **Dokumen Rujukan:** `docs/PRD.md`, `docs/TSD.md`, `docs/ROADMAP.md` (Sprint 2), `AGENTS.md`
> **Target:** Menyiapkan fondasi monolit modular Next.js 15+ (App Router, React 19, TypeScript, Tailwind CSS), struktur folder **FDA** & **Modular Backend**, Prisma ORM + `pgvector` di Neon (`dev` branch), klien Cloudflare R2, serta klien Google AI SDK.

---

## 1. Tujuan & Batasan
- **In-Scope (Sprint 2):**
  1. Inisialisasi project Next.js App Router + TypeScript + Tailwind CSS + ESLint di root workspace (`e:\project-nextjs\next-role`) **tanpa menimpa** `.env.local`, `.gitignore`, `docs/`, dan `README.md`.
  2. Instalasi dependensi inti sesuai `docs/ROADMAP.md` (UI, DnD-Kit, Prisma v6+, Vercel AI SDK, Cloudflare R2 S3 SDK, Auth.js v5, Zod, Scalar API Reference).
  3. Pembuatan kerangka folder baku **Frontend (FDA)** dan **Backend (Modular Layered Repository Pattern)**.
  4. Penulisan `prisma/schema.prisma` sesuai `docs/TSD.md` (termasuk `vector(768)` pada `User` & `Application`, plus `JobParseCache`, `ActivityLog`, `Account`, `Session`).
  5. Pembuatan singleton config server (`src/config/db.ts`, `src/config/ai.ts`, `src/config/r2.ts`), konstanta (`src/constants/index.ts`), utilitas murni bebas RegEx (`src/utils/`), dan template `.env.example`.
  6. Verifikasi koneksi ke Neon `dev` branch + `prisma generate` + `npm run build` / `tsc --noEmit` bebas error.
- **Out-of-Scope (Sprint 3–5):**
  - Implementasi lengkap endpoint API (`auth`, `job-parser`, `applications`, `profile`, `follow-up`), migrasi tabel final (masuk awal Sprint 3), dan komponen UI halaman penuh (Sprint 4).

---

## 2. Langkah Eksekusi Terperinci

### Langkah 2.1 — Scaffolding Next.js & Dependensi Inti
1. Buat `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, dan `src/app/` (dengan layout dasar `Plus Jakarta Sans` & `globals.css` Tailwind v4/v3 sesuai Next.js 15+) di root proyek.
2. Install runtime dependencies:
   - **UI & Interaksi:** `lucide-react`, `clsx`, `tailwind-merge`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
   - **Database & Validasi:** `@prisma/client`, `zod`
   - **AI Engine:** `ai`, `@ai-sdk/google`
   - **Cloudflare R2:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
   - **Autentikasi:** `next-auth@beta`
   - **API Docs:** `@scalar/nextjs-api-reference`
3. Install dev dependencies:
   - `prisma`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`

### Langkah 2.2 — Setup Kerangka Folder Standar (FDA & Modular Backend)
1. **Frontend (Feature-Driven Architecture):**
   - `src/components/ui/` (disiapkan `cn.ts` / index placeholder)
   - `src/features/auth/{components,api,types}/`
   - `src/features/clipper/{components,api,types}/`
   - `src/features/kanban/{components,hooks,types}/`
   - `src/features/application-detail/{components,hooks,types}/`
   - `src/features/profile/{components,api,types}/`
   - `src/features/analytics/components/`
2. **Backend (Modular Layered Repository Pattern):**
   - `src/config/` (`db.ts`, `ai.ts`, `r2.ts`, `env.ts`)
   - `src/constants/` (`application.ts` — enum `ApplicationStatus`, `MAX_DAILY_AI_CLIPS = 20`, pesan error baku)
   - `src/middlewares/` (`error-handler.ts`, `auth-guard.ts`, `sanitizer.ts` — **bebas RegEx**)
   - `src/utils/` (`date.ts`, `hash.ts` SHA-256, `format.ts` — **bebas RegEx**)
   - `src/modules/auth/`
   - `src/modules/profile/`
   - `src/modules/job-parser/`
   - `src/modules/applications/`
   - `src/modules/follow-up/`

### Langkah 2.3 — Konfigurasi Prisma (`pgvector` + Neon), R2, & AI SDK
1. Buat `prisma/schema.prisma` persis mengikuti model di `docs/TSD.md` (`User`, `Account`, `Session`, `Application`, `ActivityLog`, `JobParseCache`, enum `ApplicationStatus`).
2. Tambahkan `src/config/env.ts` dengan validasi `zod` untuk memastikan seluruh env vars server (`DATABASE_URL`, `DIRECT_URL`, `GEMINI_API_KEY`, `R2_*`, `AUTH_*`) terbaca aman hanya di sisi server.
3. Buat singleton:
   - `src/config/db.ts` — Singleton `PrismaClient` (aman untuk Next.js hot-reload).
   - `src/config/ai.ts` — Inisialisasi `@ai-sdk/google` memakai `GEMINI_API_KEY`, konstanta model `gemini-3.5-flash-lite` dan `gemini-embedding-2` (`768d`).
   - `src/config/r2.ts` — Singleton `S3Client` mengarah ke `R2_ENDPOINT` dengan `R2_ACCESS_KEY_ID` & `R2_SECRET_ACCESS_KEY` (region `auto`).
4. Buat `.env.example` (aman di-commit ke GitHub tanpa secret) berisi daftar kunci yang diperlukan.

### Langkah 2.4 — Verifikasi Teknis & Kepatuhan Aturan
1. Jalankan `npx prisma generate` dan `npx prisma validate`.
2. Uji koneksi ke Neon `dev` branch + pastikan ekstensi `pgvector` siap (`npx prisma db execute --stdin` / cek `SELECT version();`).
3. Jalankan audit **Zero RegEx Policy** di seluruh `src/` (memastikan nol `RegExp` atau literal `/pattern/`).
4. Jalankan `npx tsc --noEmit` dan `npm run build` untuk memastikan nol error TypeScript & Next.js build lulus.

---

## 3. Kriteria Selesai (Acceptance Criteria)
- [ ] `package.json` terpasang lengkap dengan dependensi Sprint 2.
- [ ] Struktur folder `src/features/*` dan `src/modules/*` sesuai `docs/TSD.md`.
- [ ] `prisma/schema.prisma` valid dan `prisma generate` sukses.
- [ ] `src/config/{db,ai,r2,env}.ts` siap dipakai dan tidak mengekspos rahasia ke client bundle.
- [ ] `npx tsc --noEmit` & `npm run build` lulus tanpa error.
- [ ] File privat (`AGENTS.md`, `docs/ROADMAP.md`, `docs/next-role.figcraft`, `docs/INFRA.md`, `.env.local`) ter-gitignore dan tidak ikut ke-commit.
