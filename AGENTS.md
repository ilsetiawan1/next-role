# NextRole — Standar Terpadu Desain & Pengembangan Proyek

> **Metadata Proyek:**
> - **Nama Aplikasi:** NextRole (Intelligent Job Hunt Assistant)
> - **Dokumen Rujukan:** `docs/PRD.md` (Product Requirements), `docs/TSD.md` (Technical Specifications), & `docs/ROADMAP.md` (Execution Roadmap)
> - **Pola Arsitektur:** Frontend (Feature-Driven Architecture) • Backend (Modular Layered Repository Pattern)
> - **Basis Data:** PostgreSQL (Neon Serverless) via Prisma ORM v6+ (Koneksi Pooled Port 6543)
> - **Mesin AI:** Google Gemini 1.5 Flash via Vercel AI SDK (`ai` & `@ai-sdk/google`)
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
* ⚠️ **Pencegahan Crash Server:** Pengguna (*User*) **wajib membuka aplikasi FigCraft secara manual terlebih dahulu di `localhost:7979`** sebelum Agent mengirim perintah canvas apa pun. Jangan memanggil MCP FigCraft jika server belum aktif.
* **Auto-Save:** Panggil `save_file` setelah menyelesaikan revisi kanvas utama.

### A.1. Integrasi Skills Desain
* **`antislop-ui`**: Wajib dipatuhi untuk menjaga desain tetap bernapas (*airy*), modern, minimalis, dan bebas dari tampilan klise AI.
* **`antislop-layoutmobile`**: Wajib dipatuhi saat membuat frame layar ponsel (target sentuh $\ge 44 \times 44$ px, form terpusat/centered).
* **`antislop-copywriting`**: Wajib dipatuhi untuk teks tombol, label, dan dialog agar singkat, jelas, dan natural (tanpa bahasa marketing klise).

### A.2. Aturan Estetika & Anti-AI Slop
* **Bebas Pill/Badge Soup:** Dilarang membungkus setiap teks atau status ke dalam kotak/badge kapsul berwarna-warni pekat. Gunakan indikator minimalis: satu titik warna 6px di samping teks netral.
* **Tipografi & Hirarki Brand:**
  * **Logo/Brand:** Wajib menggunakan font display geometris berkarakter tegas (*Plus Jakarta Sans* atau *Outfit*) dengan *letter-spacing* tegas agar ter-highlight dari konten lainnya.
  * **Konten & Body:** Gunakan font antarmuka netral (*Inter*).
  * **Bebas Teks Fluff:** Hilangkan teks pemasaran, jargon AI, atau kutipan panjang pada antarmuka fungsional.
* **Efek Kaca (*Glassmorphism*):**  
  Gunakan refraksi halus: `backgroundBlur` (radius 20–36px), isian putih transparan (`#FFFFFFB8` – `#FFFFFFEE`), border tipis 1px, dan drop shadow lembut. Kontras teks wajib memenuhi $\ge 4.5:1$.

### A.3. Pemetaan Visual Persis PRD & TSD (Anti-Melenceng)
* **6 Kolom Pipeline Kanban:** Wajib persis mencerminkan enum `ApplicationStatus` di TSD:
  1. `Wishlist`
  2. `Applied`
  3. `Follow-Up Needed`
  4. `Interview Scheduled`
  5. `Offered`
  6. `Rejected / Ghosted`
* **Detail Drawer:** Wajib memuat 3 tab persis sesuai spesifikasi:
  1. Tab Ringkasan & Riwayat (*Overview & Timeline*)
  2. Tab Arsip JD Snapshot (*Permanent Job Description Text*)
  3. Tab Follow-Up Generator (Draf dwi-bahasa ID/EN + indikator H+7)
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
│   ├── application-detail/     # Drawer Detail Lamaran & Arsip JD
│   │   ├── components/         # DetailDrawer.tsx, JdSnapshotTab.tsx, FollowUpTab.tsx
│   │   ├── hooks/              # useFollowUpGenerator.ts
│   │   └── types/              # detail.types.ts
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
├── config/                     # Singleton Prisma Client (db.ts), Google AI SDK client
├── constants/                  # ApplicationStatus enum, pesan error baku
├── middlewares/                # Auth guard, error handler, sanitizer
├── utils/                      # Helper murni (date manipulation, string formatters)
└── modules/
    ├── auth/                   # Autentikasi akun & session guest
    │   ├── auth.routes.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   ├── auth.openapi.ts
    │   └── __tests__/
    │
    ├── job-parser/             # Ekstraksi AI terstruktur (Gemini 1.5 Flash via AI SDK)
    │   ├── job-parser.routes.ts
    │   ├── job-parser.controller.ts
    │   ├── job-parser.service.ts
    │   ├── job-parser.openapi.ts
    │   └── __tests__/
    │
    ├── applications/           # CRUD Lamaran, Soft-Delete, dan Transisi Status
    │   ├── applications.routes.ts
    │   ├── applications.controller.ts
    │   ├── applications.service.ts
    │   ├── applications.repository.ts # Prisma queries (filter otomatis deletedAt IS NULL)
    │   ├── applications.openapi.ts
    │   └── __tests__/
    │
    └── follow-up/              # Penghitungan H+7 & Generator Draf Pesan
        ├── follow-up.routes.ts
        ├── follow-up.controller.ts
        ├── follow-up.service.ts
        ├── follow-up.openapi.ts
        └── __tests__/
```

* **Entitas Database Prisma (Model Inti):**
  1. `User` — Identitas pengguna (id, name, email, passwordHash, createdAt, updatedAt).
  2. `Account` & `Session` — Integrasi NextAuth / Auth.js untuk Google OAuth.
  3. `Application` — Entitas sentral lamaran kerja (userId, companyName, position, location, employmentType, salaryRange, keyRequirements, **jdSnapshot**, status, appliedAt, followUpAt, interviewAt, recruiterName, recruiterContact, **deletedAt**).
  4. `ActivityLog` — Catatan riwayat status dan follow-up per lamaran (applicationId, actionType, notes, createdAt).
* **Alur Eksekusi Data (Strict Layering):**
  ```text
  Client Request ──> Route ──> Controller ──> Service ──> Repository ──> Prisma/Neon
                                                  │
                                                  └──> Google Gemini Flash (AI SDK)
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
* **Proteksi Rahasia:** Kunci API (`GEMINI_API_KEY`, `AUTH_SECRET`, `DATABASE_URL`) hanya boleh diakses di sisi server melalui environment variables.
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
