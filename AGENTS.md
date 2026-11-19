# NextRole — Standar Terpadu Desain & Pengembangan Proyek

> **Metadata Proyek:**
> - **Nama Aplikasi:** NextRole (Intelligent Job Hunt Assistant)
> - **Dokumen Rujukan:** `docs/PRD.md` (Product Requirements), `docs/TSD.md` (Technical Specifications), & `docs/ROADMAP.md` (Execution Roadmap)
> - **Pola Arsitektur:** Frontend (Feature-Driven Architecture) • Backend (Modular Layered Repository Pattern)
> - **Basis Data:** PostgreSQL (Neon Serverless + `pgvector`) via Prisma ORM v6+ (Koneksi Pooled Port 6543)
> - **Penyimpanan Objek:** Cloudflare R2 (`Standard`, Private Bucket + Presigned URL)
> - **Mesin AI:** Google Gemini 3.5 Flash Lite & Gemini Embedding 2 (`768d`) via Vercel AI SDK (`ai` & `@ai-sdk/google`)
> - **Alat Desain:** FigCraft (Canvas Control via Localhost 7979)
> - **Remote Repository:** `https://github.com/ilsetiawan1/next-role.git`

---

## 0. Instruksi Inisialisasi Proyek (Agent Setup Directive)

Setiap kali memulai atau melanjutkan sesi dalam workspace NextRole:
1. **Kepatuhan Fondasi Dokumen:**  
   Agent **WAJIB mematuhi spesifikasi di `docs/PRD.md`, `docs/TSD.md`, dan alur sprint di `docs/ROADMAP.md`**. Seluruh rancangan antarmuka dan implementasi kode tidak boleh menyimpang dari batasan fungsional dan teknis yang telah disepakati.
2. **Sinkronisasi Mandiri Dokumen:**  
   Dokumen ini (`AGENTS.md`) telah disinkronkan secara resmi dengan arsitektur NextRole:
   * Fitur-fitur FDA terdaftar di Bagian B.1.
   * Modul-modul domain backend dan entitas Prisma terdaftar di Bagian B.2.
   * Protokol keselamatan kanvas FigCraft diuraikan di Bagian A.
3. **Penyelarasan Desain ke Skema Data:**  
   Dilarang keras merancang tombol, badge status, form input, atau elemen visual di FigCraft yang tidak memiliki padanan skema data pada TSD.

---

## 1. Standar Workflow Git & GitHub

Untuk menjaga kode tetap terisolasi, stabil, dan bersih:
* **Larangan Commit Langsung:** Dilarang keras melakukan commit langsung ke branch utama (`main` atau `master`) pada pengerjaan modul fitur.
* **Isolasi Fitur Baru:** Setiap mulai mengerjakan fitur, modul, atau perbaikan baru, wajib membuat branch terisolasi dari branch `main`:
  * Fitur baru: `feat/<nama-fitur>` (contoh: `feat/kanban-dnd`, `feat/job-clipper`)
  * Perbaikan bug: `fix/<nama-bug>` (contoh: `fix/follow-up-date-calculation`)
  * Refaktorisasi: `refactor/<nama-modul>` (contoh: `refactor/applications-repository`)
* **Konvensi Pesan Commit (Conventional Commits):**  
  Gunakan awalan baku: `feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`.
* **Protokol:** Konfirmasi atau laporkan nama branch yang dibuat kepada pengguna sebelum mulai memodifikasi kode.
* **First Commit & Push:** Branch `main` dihubungkan ke repository target `https://github.com/ilsetiawan1/next-role.git`.

---

## 2. Bagian A: Standar Desain UI/UX (FigCraft Workflow)

Aturan ini aktif saat Agent diminta membuat, merancang, atau merevisi visual di kanvas FigCraft.

### A.0. Protokol Keselamatan Server FigCraft
* **[PERINGATAN] Pencegahan Crash Server:** Pengguna (*User*) **wajib membuka aplikasi FigCraft secara manual terlebih dahulu di `localhost:7979`** sebelum Agent mengirim perintah canvas apa pun. Jangan memanggil MCP FigCraft jika server belum aktif.
* **Perintah Menjalankan FigCraft di Command Prompt (CMD):**
  ```cmd
  "D:\ArtCraft\FigCraft\figcraft.exe" --control 7979 "E:\project-nextjs\next-role\docs\next-role.figcraft"
  ```
* **Target MCP Server untuk Live GUI:** Wajib menggunakan `ServerName: "figcraft-app"` (bukan daemon headless `figcraft`) agar setiap modifikasi layer langsung terhubung dan tampil secara *realtime* di jendela FigCraft aktif.
* **Auto-Save:** Panggil `save_file` setelah menyelesaikan revisi kanvas utama.

### A.1. Integrasi Skills Desain
* **`antislop-ui`**: Wajib dipatuhi untuk menjaga desain tetap bernapas (*airy*), modern, minimalis, dan bebas dari tampilan klise AI.
* **`antislop-layoutmobile`**: Wajib dipatuhi saat membuat frame layar ponsel (target sentuh $\ge 44 \times 44$ px, form terpusat/centered).
* **`antislop-copywriting`**: Wajib dipatuhi untuk teks tombol, label, dan dialog agar singkat, jelas, dan natural (tanpa bahasa marketing klise).

### A.2. Aturan Estetika & Soft Sky Glass Elevation (v3.0.0)
* **Kanvas Sky Gradient:** Latar belakang kanvas menggunakan gradasi sangat halus dari putih ke biru langit (`#F4F9FF` → `#E3F1FD` / `linear-gradient(180deg, #F4F9FF 0%, #E3F1FD 100%)`) dengan sentuhan blob blur biru samar untuk kedalaman visual.
* **Frosted Cards (Kartu Kaca Bertingkat):** Kartu antarmuka menggunakan permukaan kaca putih semi-transparan (`rgba(255, 255, 255, 0.72)` / `bg-white/70`), blur halus (`backdrop-blur-md` 16px), sudut membulat `rounded-3xl` (24px), border ultra-halus (`border border-white/90`), dan bayangan difus **bernuansa biru** (`box-shadow: 0 12px 32px -8px rgba(2, 132, 199, 0.16), 0 2px 6px rgba(2, 132, 199, 0.06)`).
* **Satu Hero Card per Layar (Prioritas Tertinggi):** Item paling mendesak (H+7 follow-up / interview terdekat) menggunakan kartu gradien biru memukau (`linear-gradient(135deg, #38A9E8 0%, #0284C7 55%, #075985 100%)`), teks putih, glossy radial highlight, logo lingkaran putih 44x44, dan tombol aksi sudut putih (`bg-white text-sky-700 font-semibold px-4 py-2 rounded-xl`).
* **Reminder Strip:** Strip kaca biru muda di bawah header memuat agenda terdekat dengan kotak digit waktu `[09][:][45]` (`w-8 h-10 rounded-lg bg-sky-100 text-sky-800 font-bold`).
* **Search Bar & Filter Chips (Peek Edge):**
  * Search bar pill putih `h-12 rounded-2xl` dengan tombol filter kotak `40x40 rounded-xl bg-sky-100 text-sky-700` di kanan.
  * Filter chips scroll horizontal: chip aktif gradien `sky-400→sky-600` teks putih; chip nonaktif `bg-white/70 text-slate-700 border border-white`.
* **Status Badges (Soft Pills):** Menggunakan kapsul pastel lembut dengan teks berbobot `-700` (kontras $\ge 4.5:1$):
  * `Applied`: `bg-blue-50 text-blue-700 border border-blue-100` (`#EFF6FF` / `#1D4ED8`)
  * `Follow-Up (H+7)`: `bg-amber-50 text-amber-700 border border-amber-100` (`#FFFBEB` / `#B45309`)
  * `Interview`: `bg-purple-50 text-purple-700 border border-purple-100` (`#FAF5FF` / `#7E22CE`)
  * `Offer`: `bg-emerald-50 text-emerald-700 border border-emerald-100` (`#ECFDF5` / `#047857`)
  * `Ghosted / Rejected`: `bg-rose-50 text-rose-700 border border-rose-100` (`#FFF1F2` / `#BE123C`)
* **Arsitektur Kartu Lamaran (Card Architecture):**
  1. Baris 1: Logo Perusahaan bulat (`40x40 rounded-full bg-white shadow-sm`) + Nama Perusahaan & Lokasi + Soft Status Badge + tombol bookmark bulat.
  2. Baris 2: Nama Posisi Kerja (`Bold, text-base/16px, text-slate-900`) + Rentang Gaji (`text-sm font-medium text-slate-700`).
  3. Baris 3: Tags Metadata (`text-xs bg-white/80 border border-sky-100 text-slate-700 px-2.5 py-1 rounded-full`).
  4. Baris 4: Indikator waktu di kiri bawah dan tombol aksi ringkas di pojok kanan bawah (`text-xs font-semibold px-3.5 py-2 rounded-xl bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white transition-all`). Dilarang memakai tombol lebar penuh (*full-width solid buttons*) di dalam kartu.
* **Tipografi & Hirarki Brand:**
  * Font terpadu: `Plus Jakarta Sans` untuk judul dan body (ukuran teks minimum absolut **12px**).
* **Struktur Navigasi Responsif:**
  * **Desktop (≥1024px / 1280px+):** Top Floating Glass Pill Navbar (`Home`, `Roles`, `Analytics`, `Profile`), badge kuota harian `18 / 20 Klip`, tombol utama `+ Catat Lamaran`, dan avatar profil.
  * **Tablet (768px - 1023px):** Top Floating Pill Navbar (`Home`, `Roles`, `Analytics`, `Profile`), grid 2 kolom seimbang untuk kartu & inspektor, dan Detail sebagai Persistent Inspector / Modal Sheet.
  * **Mobile (<768px):** Floating Pill Nav Dock (`h-[68px] rounded-[28px]`, `bg-white/85 backdrop-blur-xl border border-white shadow-lg`) dengan **Raised Center FAB** untuk aksi **Catat Lamaran**. Seluruh 4 tab (`Home`, `Roles`, `Analytics`, `Profile`) menampilkan label teks yang terbaca jelas.
* **Detail Lamaran Berbasis Sheet:**
  * Format: Bottom Sheet 88% di Mobile, Modal Sheet di Tablet, dan Right Drawer `w-[480px]` di Desktop.
  * Komponen Detail: Logo bulat 72x72 menimpa tepi atas sheet (`-mt-9` center), judul posisi center H1 + gaji, segmented tabs (`Deskripsi` | `Perusahaan` | `Draf Pesan`), 3-kolom Info Strip, Job Details, dan **Slide-to-Action** CTA slider (`h-14 rounded-full` dengan animasi chevrons `›››››` dan fallback tap untuk keyboard).

### A.3. Pemetaan Visual Persis PRD & TSD (Anti-Melenceng)
* **5 Kolom Pipeline Kanban Langsung (Tanpa Wishlist):** Wajib mencerminkan tahap pipeline di TSD (`ApplicationStatus`):
  1. `Applied`
  2. `Follow-Up Needed`
  3. `Interview` (`INTERVIEW_SCHEDULED`)
  4. `Offered`
  5. `Rejected / Ghosted`
* **Detail Lamaran (Inspector / Sheet):** Wajib memuat tab atau blok kontekstual sesuai spesifikasi:
  1. Ringkasan & Riwayat (*Overview & Timeline*)
  2. Arsip JD Snapshot (*Permanent Job Description Text*) + `Kualifikasi Kunci Terdeteksi` + pill **`Kecocokan CV: XX%`** (`pgvector`)
  3. Follow-Up Generator (Draf dwi-bahasa ID/EN + indikator H+7)
* **Halaman Login:** Wajib menyediakan opsi Google OAuth dan tombol 1-Click "Explore as Guest / Mode Demo".
* **Penamaan Frame Kanvas:**  
  Format: `[Nama Layar] - (Desktop 1440x900)` atau `[Nama Layar] - (Mobile 390x844)`.
* **Generasi Bertahap (*Live Generation*):** Buat komponen per blok logis (Background $\rightarrow$ Kontainer $\rightarrow$ Navigasi $\rightarrow$ Konten $\rightarrow$ Aksi) agar pengguna dapat memantau prosesnya di layar.

---

## 3. Bagian B: Standar Pengembangan Kode (Full-Stack Engineering)

Aturan ini aktif saat Agent diminta mengimplementasikan kode aplikasi frontend maupun backend.

### B.1. Frontend: Feature-Driven Architecture (FDA)
Seluruh kode frontend dikelompokkan berdasarkan **domain fitur bisnis NextRole**:
```text
src/
├── components/
│   └── ui/                     # Komponen atomik bersama (Button, Input, Modal, Drawer, Badge)
├── features/
│   ├── auth/                   # Modul Otentikasi (Google OAuth, Guest Demo Session)
│   │   ├── components/         # LoginForm.tsx, GuestLoginButton.tsx
│   │   ├── api/                # authApi.ts
│   │   └── types/              # auth.types.ts
│   │
│   ├── clipper/                # Modal Smart Job Clipper (Input Link & Raw Text)
│   │   ├── components/         # ClipperModal.tsx, RawTextInput.tsx, ParsedReviewForm.tsx
│   │   ├── api/                # clipperApi.ts (panggil POST /api/v1/parser/extract)
│   │   └── types/              # clipper.types.ts
│   │
│   ├── kanban/                 # Papan Visual Kanban Interaktif
│   │   ├── components/         # KanbanBoard.tsx, KanbanColumn.tsx, ApplicationCard.tsx
│   │   ├── hooks/              # useKanbanDnD.ts (DnD-Kit integration & optimistic updates)
│   │   └── types/              # kanban.types.ts
│   │
│   ├── application-detail/     # Drawer Detail Lamaran, Arsip JD, & CV Match Score
│   │   ├── components/         # DetailDrawer.tsx, JdSnapshotTab.tsx, FollowUpTab.tsx, MatchScoreBadge.tsx
│   │   ├── hooks/              # useFollowUpGenerator.ts
│   │   └── types/              # detail.types.ts
│   │
│   ├── profile/                # Halaman Profile, Kuota AI, Upload & Preview PDF CV
│   │   ├── components/         # ProfileView.tsx, CvProfileModal.tsx, CvPdfPreviewModal.tsx
│   │   ├── api/                # profileApi.ts
│   │   └── types/              # profile.types.ts
│   │
│   └── analytics/              # Kartu Ringkasan Metrik
│       └── components/         # MetricsCards.tsx (Total Applied, Response Rate, H+7 Pending)
└── app/                        # App Router Pages, Layouts, & API Route Handlers
```
* **Aturan Impor:** Komponen internal fitur hanya boleh diakses fitur lain melalui `index.ts` fitur terkait.
* Dilarang keras melakukan ketergantungan melingkar (*circular dependency*) antar folder fitur.

### B.2. Backend: Modular Layered Architecture dengan Repository Pattern
Seluruh kode backend dikelompokkan berdasarkan **modul domain NextRole** di dalam folder `src/modules/<nama-modul>/`:

```text
src/
├── config/                     # Singleton Prisma Client (db.ts), Google AI SDK, Cloudflare R2 S3 Client (r2.ts)
├── constants/                  # ApplicationStatus enum, pesan error baku
├── middlewares/                # Auth guard, error handler, sanitizer
├── utils/                      # Helper murni (date manipulation, SHA-256 hash, string formatters)
└── modules/
    ├── auth/                   # Autentikasi akun & session guest
    │   ├── auth.routes.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   ├── auth.openapi.ts
    │   └── __tests__/
    │
    ├── profile/                # Manajemen CV PDF (R2 Private Bucket + Presigned URL) & CV Embedding (768d)
    │   ├── profile.routes.ts
    │   ├── profile.controller.ts
    │   ├── profile.service.ts
    │   ├── profile.repository.ts
    │   ├── profile.openapi.ts
    │   └── __tests__/
    │
    ├── job-parser/             # Ekstraksi AI (Gemini 3.5 Flash Lite), Cache SHA-256, & Zod Retry Guard
    │   ├── job-parser.routes.ts
    │   ├── job-parser.controller.ts
    │   ├── job-parser.service.ts
    │   ├── job-parser.repository.ts # Akses JobParseCache (SHA-256 deduplication)
    │   ├── job-parser.openapi.ts
    │   └── __tests__/
    │
    ├── applications/           # CRUD Lamaran, Soft-Delete, JD Embedding, & pgvector Match Score
    │   ├── applications.routes.ts
    │   ├── applications.controller.ts
    │   ├── applications.service.ts
    │   ├── applications.repository.ts # Prisma queries + pgvector <=> similarity (filter deletedAt IS NULL)
    │   ├── applications.openapi.ts
    │   └── __tests__/
    │
    └── follow-up/              # Penghitungan H+7 & Generator Draf Pesan (Gemini 3.5 Flash Lite)
        ├── follow-up.routes.ts
        ├── follow-up.controller.ts
        ├── follow-up.service.ts
        ├── follow-up.openapi.ts
        └── __tests__/
```

* **Entitas Database Prisma (Model Inti):**
  1. `User` — Identitas pengguna, kuota harian AI, dan profil CV semantik (`id`, `name`, `email`, `passwordHash`, `dailyAiClipsCount`, `lastClipResetAt`, `cvFileKey`, `cvFileName`, `cvText`, `cvHash`, `cvEmbedding` (`vector(768)`), `cvUpdatedAt`, `createdAt`, `updatedAt`).
  2. `Account` & `Session` — Integrasi NextAuth / Auth.js untuk Google OAuth.
  3. `Application` — Entitas sentral lamaran kerja (`userId`, `companyName`, `position`, `location`, `employmentType`, `salaryRange`, `jobSource`, `jobUrl`, `keyRequirements`, **`jdSnapshot`**, **`jdEmbedding`** (`vector(768)`), `status`, `appliedAt`, `followUpAt`, `interviewAt`, `recruiterName`, `recruiterContact`, **`deletedAt`**).
  4. `ActivityLog` — Catatan riwayat status dan follow-up per lamaran (`applicationId`, `actionType`, `notes`, `createdAt`).
  5. `JobParseCache` — Cache deduplikasi hasil ekstraksi Smart Job Clipper berbasis SHA-256 (`id`, `contentHash`, `inputType`, `parsedPayload`, `modelVersion`, `createdAt`).
* **Alur Eksekusi Data (Strict Layering):**
  ```text
  Client Request ──> Route ──> Controller ──> Service ──> Repository ──> Prisma / Neon (pgvector)
                                                  │
                                                  ├──> Gemini 3.5 Flash Lite & Gemini Embedding 2
                                                  └──> Cloudflare R2 (Private Bucket + Presigned URL)
  ```
* **Colocation Spesifikasi API:** Skema dokumentasi API (`<modul>.openapi.ts`) wajib diletakkan langsung di dalam modul bersangkutan dan terdaftar pada viewer Scalar di `/docs`.
* **Larangan Ketat:**
  * Controller **dilarang** memanggil Repository secara langsung (wajib melalui Service).
  * Query SQL / Prisma Client **dilarang** ditulis di Controller maupun Service (wajib di Repository).
  * Antar-modul dilarang mengakses Repository milik modul lain secara langsung (harus melalui Service).

### B.3. Anti-Overengineering (`ponytail`)
Terapkan prinsip *pragmatic senior dev* dari skill **`ponytail`**:
* Jangan membuat interface, factory, atau abstract class kosong jika implementasinya hanya 1.
* Jangan memecah komponen sederhana 25 baris menjadi 4 file terpisah jika masih nyaman dibaca dalam 1 file.
* Jangan membuat lapisan wrapper DTO bertingkat jika tipe model data sudah jelas.
* Tulis kode yang langsung menyelesaikan masalah (*working, robust code*).

### B.4. Keamanan Sistem Produksi (`security-audit`)
Patuhi standar skill **`security-audit`**:
* **Sanitasi Input:** Validasi tipe dan sanitasi seluruh payload di Controller & Service menggunakan `zod` (cegah SQLi, XSS, injection).
* **Otorisasi Ketat:** Validasi kepemilikan data (`userId`) di lapisan Service, bukan hanya mengandalkan frontend.
* **Proteksi Rahasia:** Kunci API (`GEMINI_API_KEY`, `AUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) hanya boleh diakses di sisi server melalui environment variables.
* **Proteksi PII Dokumen CV:** File PDF CV disimpan di Private Bucket Cloudflare R2 dan hanya boleh diakses via Presigned URL sementara setelah verifikasi kepemilikan `session.user.id`.
* **Error Handling Aman:** Jangan mengekspos *stack trace* database internal ke response client.

### B.5. Larangan Keras Penggunaan RegEx (Zero RegEx Policy)
* **Dilarang Menggunakan RegEx:** Dilarang keras menulis atau menerapkan Regular Expression (`RegExp`, pola regex, atau sintaks `/pattern/`) dalam logika kode apa pun, baik di Frontend maupun Backend.
* **Alasan:** Mencegah kerentanan ReDoS (*Regular Expression Denial of Service*), beban komputasi yang tidak terduga, dan menjaga kode tetap mudah dibaca/di-debug.
* **Alternatif Wajib yang Harus Digunakan:**
  * Gunakan metode string bawaan (*native string methods*): `.includes()`, `.startsWith()`, `.endsWith()`, `.indexOf()`, `.split()`, `.slice()`, `.trim()`.
  * Untuk validasi format (email, URL, UUID): Gunakan library skema validator resmi (misal: `zod`) atau parser bawaan bahasa (misal: `new URL()`).
  * Untuk parsing pola: Gunakan pemisahan berbasis delimiter (*tokenizing*) atau perulangan logika (*loop*) yang eksplisit dan mudah dipahami.

---

## 4. Bagian C: Protokol Transisi (Desain FigCraft ke Kode)

Saat pengguna meminta pembuatan kode dari desain FigCraft yang sudah disetujui:
1. **Inspeksi:** Baca koordinat, warna, hierarki komponen dari FigCraft menggunakan `inspect_document` / `get_node`.
2. **Pemetaan ke FDA:** Ubah frame FigCraft menjadi struktur komponen modular di `src/features/<fitur>/components/`.
3. **Penyelarasan Desain:** Pertahankan token warna, rasio spasi 8pt, dan penamaan teks dari FigCraft ke dalam kode.
