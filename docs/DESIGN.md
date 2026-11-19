# NextRole — Dokumen Desain & Panduan Gaya UI/UX
*Versi: 3.4.0 (Color Triad Home & Roles Harmony Refactor)*

---

## 1. Ikhtisar & Arah Desain (Design Philosophy)

NextRole mengadopsi estetika **Soft Sky Glass Elevation** yang modern, bersih, dan lapang (*airy*), berlandaskan prinsip *anti-slop* UI. Antarmuka mengutamakan kejelasan hierarki informasi, rasio spasi 8-point yang konsisten, tipografi tajam, serta eliminasi ornamen atau palet pelangi (*rainbow badges*) berlebih.

### Prinsip Utama:
1. **Glassmorphic Subtlety:** Menggunakan material kaca semi-transparan (`bg-white/75 backdrop-blur-xl border border-white/90`) dengan bayangan difus biru langit (`0 12px 32px -8px rgba(2, 132, 199, 0.12)`).
2. **Deterministic & Token-Efficient:** Visual dashboard mengutamakan data riil dari database (kuota, target mingguan, pipeline jadwal) tanpa memanggil LLM untuk hal statis. LLM hanya digunakan pada fitur esensial (*Job Parser* dan *Follow-Up Generator*).
3. **Responsive Symmetrical Balance:** Setiap breakpoint (Desktop 1440px, Tablet 834px, Mobile 390px) memiliki batas garis dasar (*baseline alignment*) dan ritme vertikal yang rapi tanpa celah *white space* timpang.

---

## 2. Token Desain Terpadu

### A. Palet Warna (Color Palette)
* **Background Kanvas:** Gradasi linear halus `#F4F9FF` $\rightarrow$ `#E3F1FD` (180deg).
* **Primary Sky:** `#0284C7` (Sky-600) untuk aksi utama, link interaktif, dan highlight aktif.
* **Primary Deep:** `#0369A1` (Sky-700) / `#075985` (Sky-800) untuk hover dan penekanan.
* **Neon Lime Accent:** `#D4FF47` (berpasangan dengan teks `#0C4A6E`) untuk CTA banner, pill kuota harian navbar (`18 / 20 Klip`), micro-pill prioritas `H+7`/`H+8`, badge target mingguan, pill `12 lamaran` folder aktif, dan pill `Kecocokan CV: 84%`.
* **Neutral Slate:**
  * Title/Headings: `#0F172A` (Slate-900)
  * Body/Text & Rentang Gaji Kartu: `#334155` (Slate-700) — menjaga fokus link biru hanya pada tombol `Detail ↗`
  * Secondary/Muted & Tautan Seksi: `#475569` / `#64748B` (Slate-600/500)
  * Borders/Dividers: `#E2E8F0` (Slate-200) atau `#FFFFFF` semi-transparan
* **Status Badges (Soft Pastel with Dark Text):**
  * `Applied`: `bg-blue-50 text-blue-700 border-blue-100` (`#EFF6FF` / `#1D4ED8`)
  * `Follow-Up Needed (H+7)`: `bg-amber-50 text-amber-700 border-amber-100` (`#FFFBEB` / `#B45309`)
  * `Interview Scheduled`: `bg-purple-50 text-purple-700 border-purple-100` (`#FAF5FF` / `#7E22CE`)
  * `Offered`: `bg-emerald-50 text-emerald-700 border-emerald-100` (`#ECFDF5` / `#047857`)
  * `Rejected / Ghosted`: `bg-rose-50 text-rose-700 border-rose-100` (`#FFF1F2` / `#BE123C`)

### B. Tipografi
* **Font Family:** `Plus Jakarta Sans` / `Poppins` (Fallback: `Inter`, system sans-serif).
* **Ukuran Minimum:** 10px untuk metadata/chips, 12px untuk tombol dan body text.

---

## 3. Spesifikasi Tata Letak Per Perangkat (Home Screen)

### A. Mobile (< 768px / 390x844, `cornerRadius: 36px`, `clip: true`)
* **Top Bar:** Brand mark + `nextrole` + search bar pill + filter modal trigger.
* **Horizontal Filters:** Pill scroll horizontal (*Semua*, *Full-time*, *Hybrid*, *Follow-Up*).
* **Banner AI Carousel (`w: 350, h: 134`):** Promosi fitur Smart AI Clipper dengan ilustrasi 3D.
* **Perlu Tindak Lanjut Carousel (`y: 354, h: 102`):** Kartu horizontal kompak (`w: 280, h: 102`, selaras standar kartu Roles) memuat kotak inisial perusahaan (`38x38`), nama perusahaan & lokasi, link `Detail ↗` biru `#0284C7`, posisi, rentang gaji slate `#334155`, serta tombol CTA ringkas kuning neon `#D4FF47` (`Follow-Up ↗`, teks `#0C4A6E`) di pojok kanan bawah (Tokopedia, peek Apple). Tautan seksi `Lihat semua ›` memakai slate `#475569`.
* **Aktivitas Terakhir Feed (`y: 476` s.d. `y: 720`):** Kartu vertikal kompak (`w: 350, h: 102`, selaras standar kartu Roles) untuk Grab Indonesia (`y: 504`, penanda dot 6px ungu `#7E22CE` + teks netral `Interview • 13 Nov` tanpa kapsul pill) dan Shopee Indonesia (`y: 618`), berakhir aman di atas Floating Bottom Dock.
* **Floating Bottom Pill Nav Dock (`h: 68`, radius 28px):** 4 menu utama berbahasa Inggris (*Home*, *Roles*, *Analytics*, *Profile*) dengan ikon grafik batang untuk *Analytics*, ikon user untuk *Profile*, dan **Raised Center FAB (+)** untuk aksi *Catat Lamaran*.

---

### B. Tablet (768px – 1023px / 834x1194) — Top Floating Pill Navbar & 2-Kolom Seimbang
* **Top Floating Pill Navbar (`w: 786, h: 58`, radius 29px, y: 20):**
  * Kiri: Logo resmi NextRole + brand text `nextrole` (Courier New Bold, 18px).
  * Tengah: Pill navigasi terpadu (*Home* aktif, *Roles*, *Analytics*, *Profile*).
  * Kanan: Pill kuota harian kuning neon `#D4FF47` (`18/20 Klip`, teks `#0C4A6E`), tombol cepat `+`, dan avatar `BS` (32x32).
* **Banner Slider Tablet (`w: 786, h: 140`, y: 160):** Membentang penuh di atas konten.
* **Grid 2-Kolom (y: 324 s.d. y: 866 — Baseline-Locked di Y = 866):**
  * **Kolom Kiri (w: 454) — Perlu Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. 4 Kartu Lamaran selaras standar Roles (`h: 116`, gap `15px–16px`, radius `20px`, kotak logo inisial `40x40`, tombol `Detail ↗` pojok kanan atas, rentang gaji slate `#334155`, keterangan waktu ringkas (`7 hari lalu` / `8 hari lalu` / `6 hari lalu`), serta tombol CTA singkat 2 kata di pojok kanan bawah tanpa pengulangan: `Follow-Up ↗` kuning neon `#D4FF47` untuk kartu jatuh tempo dan `Buat Draf ↗` biru muda `#F0F9FF` untuk kartu mendekati batas): Tokopedia (`y: 356`), Bukalapak (`y: 487`), GoTo Financial (`y: 618`), dan Apple (`y: 750`, berakhir tepat di **Y = 866**). Tautan seksi (`Lihat semua ›`, `Bulan Ini ›`, `Buka ›`) menggunakan slate `#475569`.
  * **Kolom Kanan (w: 308) — Statistik Lamaran & Kalender Agenda:**
    1. Header "Statistik Lamaran" + link "Bulan Ini ›" (sebagai judul tunggal komponen tanpa duplikasi judul internal).
    2. Quick Analytics Bento Tablet (`h: 178`, `y: 356..534`): 4 kotak metrik simetris dengan ikon 3D squircle (Total Dilamar, Interview Aktif, Perlu Follow-Up, Tingkat Respon).
    3. Header "Kalender Agenda" + link "Buka ›" (`y: 550`).
    4. Mini Calendar Tablet (`h: 286`, `y: 580..866`, berakhir persis di **Y = 866**): Kalender November 2026 + jadwal agenda terpilih.
* **Pipeline Lamaran Grid 2x2 (y: 890 s.d. y: 1170):**
  * Header "Pipeline Lamaran" + link "Lihat semua ›" (`y: 890`).
  * Disusun dalam 2 baris x 2 kartu selaras standar kartu Roles (`w: 382, h: 116`):
    * Baris 1 (`y: 922`): **Grab Indonesia Tablet** (`x: 24`, dot 6px ungu `#7E22CE` + teks netral `Interview • 13 Nov` tanpa pill) & **Shopee Indonesia Tablet** (`x: 428`, `Dilamar: 10 Nov 2026`).
    * Baris 2 (`y: 1054`): **Traveloka Tablet** (`x: 24`, dot 6px emerald `#047857` + teks netral `Offering • 28 Okt` tanpa pill) & **Dana Indonesia Tablet** (`x: 428`, `Dilamar: 12 Nov 2026`), berakhir simetris di **Y = 1170** (margin bawah 24px).

---

### C. Desktop (≥ 1024px / 1440x1000) — 3-Column Balanced Dashboard
* **Top Floating Pill Navbar (`w: 1344, h: 64`, radius 32px, y: 20):**
  * Kiri: Logo resmi NextRole (36x36) + brand `nextrole` (Courier New Bold, 18px).
  * Tengah: Segmented pill tabs (`Home`, `Roles`, `Analytics`, `Profile`).
  * Kanan: Kuota harian pill kuning neon `#D4FF47` (`18 / 20 Klip`, teks `#0C4A6E`), tombol utama `+ Catat Lamaran` (`w: 154, h: 36`), dan avatar `BS` (36x36).
* **Baris Atas (y: 168):**
  * **Banner AI Carousel Desktop (`w: 888, h: 164`, x: 48):** Membentang lebar di atas Kolom 1 dan Kolom 2.
  * **Kolom 3 Kanan Atas (x: 960, w: 432):**
    * Header "Statistik & Kalender"
    * Quick Analytics Bento Card (`h: 220`): 4 tile metrik simetris ($188 \times 72$ px) dengan 4 ikon 3D glassmorphic seimbang, angka `#0F172A`, dan label `#64748B`. Link "Bulan Ini ›" rata kanan sejajar batas bento box ($x = 414$).
* **Baris Bawah (y: 356 s.d. y: 950):**
  * **Kolom 1 (x: 48, w: 432) — Perlu Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. 3 Kartu Lamaran selaras standar Roles (`h: 116`, gap `16px`, kotak inisial `40x40`, link `Detail ↗`, tanpa badge warna-warni/border kuning): Tokopedia (`y: 390`), Bukalapak (`y: 522`), dan GoTo Financial (`y: 654`).
  * **Kolom 2 (x: 504, w: 432) — Pipeline Lamaran:**
    1. Header "Pipeline Lamaran" + link "Lihat semua ›"
    2. 3 Kartu Lamaran selaras standar Roles (`h: 116`, gap `16px`): Grab Indonesia (`y: 390`, dot 6px `#7E22CE` + teks `Interview • 13 Nov`), Shopee Indonesia (`y: 522`, `Dilamar: 10 Nov 2026`), dan Traveloka (`y: 654`, dot 6px `#047857` + teks `Offering • 28 Okt`).
  * **Kolom 3 (x: 960, w: 432) — Kalender & Target Mingguan:**
    1. Mini Calendar Card (`h: 510`, berakhir di **Y = 950**):
       - Kalender interaktif November 2026.
       - Agenda & Wawancara Mendatang (Grab, Shopee, Tokopedia, Traveloka).
       - Widget Deterministik **"Target Lamaran Minggu Ini"**: Progress bar $80\%$ dengan pill neon kuning `#D4FF47` (`8 / 10`, teks `#0C4A6E`), 0 token AI.
       - Kartu Home & Roles menggunakan rentang gaji slate `#334155`; kartu pada seksi `Perlu Tindak Lanjut` memadukan keterangan hari (`7 hari lalu` / `8 hari lalu` / `6 hari lalu`) dengan tombol CTA singkat (`Follow-Up ↗` kuning neon `#D4FF47` dan `Buat Draf ↗` biru muda `#F0F9FF`) tanpa pengulangan label `H+...`.

---

## 4. Master File FigCraft & Riwayat Aset

* **Master Canvas File:** `docs/next-role.figcraft`
* **Aset Ikon 3D Glassmorphic:**
  * `docs/assets/icon_3d_total_dilamar.png` (Folder Dokumen 3D Glass)
  * `docs/assets/icon_3d_interview_aktif.png` (Kalender Wawancara 3D Glass)
  * `docs/assets/icon_3d_follow_up.png` (Lampu Pengingat 3D Glass)
  * `docs/assets/icon_3d_tingkat_respon.png` (Grafik Pertumbuhan 3D Glass)

---

## 5. Spesifikasi Tata Letak Halaman Roles (Workspace Hub & Split-View Inspector)

Berdasarkan tinjauan arsitektur antarmuka dan penyelarasan kebutuhan produk:
1. **Dokumentasi Lamaran Fleksibel (Bukan Kalender Kaku):**
   - Menghapus konsep "Interview Scheduled" dengan pengisian jam/jadwal kaku yang membebani pengguna. Kategori diselaraskan menjadi **`Interview`** murni sebagai tahap dokumentasi pencarian kerja.
   - Informasi kartu berfokus pada catatan tahap wawancara (*interview stage documentation*) tanpa mewajibkan form pengisian waktu yang rumit.
2. **Mekanisme Ubah Status (Drag & Drop + 1-Click Edit):**
   - Status lamaran dapat dipindahkan dengan cara **Drag & Drop** langsung ke folder status di atas (Folder sebagai Dropzone interaktif), atau melalui kontrol **Ubah Status ▾ / Edit Lamaran ✎** pada kartu dan Persistent Inspector Panel.
3. **Fitur Ekspor Rekap PDF (Tabel Semua Status):**
   - Disediakan tombol aksi utama **`⤓ Unduh Rekap PDF`** dengan badge penanda `Tabel` pada header bar (Desktop, Tablet, Mobile) untuk mengunduh rekapitulasi seluruh lamaran dari semua tahapan pipeline dalam format tabel dokumen PDF terstruktur.
4. **5 Folder Status Pipeline (Folder Hub — Ikigai Labs Style):**
   - Dirancang dengan siluet folder dokumen autentik:
     - *Pocket Recess & Document Sheet:* Lembaran dokumen putih mengintip dari saku atas folder. Pada folder aktif (**Applied**), saku folder memancarkan gradasi biru langit bercahaya (`#38BDF8` → `#0284C7`), border `#7DD3FC`, teks putih, dan elevasi bayangan difus biru (`rgba(2, 132, 199, 0.28)`).
     - *Inactive Folders Soft White:* Seluruh folder nonaktif (**Follow-Up Needed**, **Interview**, **Offered**, **Rejected**) menggunakan material kaca putih bersih `#F8FAFC` dengan flap putih `#FFFFFF/94%`, teks gelap `#0F172A`, dan bayangan netral lembut tanpa glow biru.
5. **Kebijakan Tipografi Tanpa Bold (Zero Bold & Semi-Bold Policy):**
   - Seluruh teks pada brand logo, kategori folder, kartu lamaran, header seksi, hingga panel inspektor konsisten menggunakan **`fontStyle: 'Regular'` (bobot 400)**.
6. **Eradikasi Jadwal Interview (Murni Dokumentasi Lamaran):**
   - Aplikasi NextRole berfokus murni pada pencatatan dan dokumentasi lamaran kerja.
   - Seluruh teks tanggal/jam interview, nama pewawancara, dan platform meet ditiadakan.
   - Bidang data diselaraskan 100% dengan skema `Application` pada `docs/TSD.md` dan frame `Modal Catat Lamaran`: Rentang Gaji, Tipe Kerja, Tanggal Dilamar, Sumber Lamaran, Kontak Recruiter, Lokasi Kantor, dan Arsip Snapshot JD.
7. **Komponen Transisi Status Berbasis Radio Selector:**
   - Panel inspektor kanan (Desktop & Tablet) memuat kontrol pemilihan status instan berupa radio group:
     - `(•) Applied` (bawaan terpilih untuk data folder Applied)
     - `( ) Interview`
     - `( ) Offered`
     - `( ) Rejected`
     - Catatan otomatis: `*Status Follow-Up Needed aktif otomatis oleh sistem saat H+7 tanpa respon.`

---

### B. Desktop (1440x900) — 5-Folder Hub & 2-Column Split-View
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Roles` aktif dengan kapsul biru (`#0284C7`) dan teks putih `#FFFFFF`, brand text `nextrole` (Poppins Regular).
* **Header Bar (y: 102):**
  * Judul "Papan Lamaran" (`fontSize: 26, fontStyle: Regular, #0F172A`).
  * Subtitle "Kelola 18 lamaran aktif terstruktur dalam 5 tahapan pipeline" (`fontSize: 14, #64748B`).
  * **Tombol `⤓ PDF` (`w: 88, h: 44`, x: 924, y: 104):** Tombol ringkas kaca putih dengan border `#BAE6FD` dan teks `#0284C7` format icon unduh + PDF.
  * Search bar pill (`w: 312, h: 44`, x: 1024) + filter square button (`w: 44, h: 44`, x: 1348), **sejajar presisi pada garis batas kanan $X = 1392$ px** bersama Navbar, Folder Rejected, dan Inspector Panel.
* **5 Folder Status Cards Ikigai (y: 168 s.d. 324, w: 252 masing-masing, gap: 21, h: 156):**
  * `Applied` (`Tahap terkirim` tepat di bawah judul, diikuti pill kuning neon `#D4FF47` `12 lamaran` teks `#0C4A6E` di bagian bawah — **Aktif** dengan gradasi langit `#38BDF8` → `#0284C7`, teks judul putih, dokumen mengintip di saku atas)
  * `Follow-Up Needed` (3 lamaran • micro-dot neon `#D4FF47` + `2 tepat H+7` • Inactive White `#F8FAFC`)
  * `Interview` (3 lamaran • Tahap berjalan • Inactive White `#F8FAFC`)
  * `Offered` (2 penawaran • Tahap Penawaran • Inactive White `#F8FAFC`)
  * `Rejected / Ghosted` (5 arsip • Terarsip rapi • Inactive White `#F8FAFC`)
* **Konten Bawah (y: 344 s.d. 864, h: 520):**
  * **Sisi Kiri (x: 48, w: 840) — Grid Lamaran Applied (2x2):**
    * Header seksi: **`Daftar Lamaran: Applied`** (`fontSize: 16, fontFamily: Plus Jakarta Sans, fontStyle: SemiBold, #0F172A`) + `(12 Lamaran)` (`fontSize: 16, fontFamily: Plus Jakarta Sans, fontStyle: Regular, #64748B`).
    * Subtitle panduan: "Pilih kartu di bawah untuk melihat arsip lengkap & kelola status di panel kanan" (`fontSize: 12, #64748B`).
    * 4 slot kartu lamaran ($410 \times 116$ px):
      - Avatar foto otomatis berbasis inisial nama perusahaan (`S`, `B`, `D`, `T`) dengan background gradasi langit-ke-awan (`#BAE6FD` → `#F0F9FF`) dan border `#BAE6FD`.
      - **Tombol CTA Pojok Kanan Atas:** Text button bersih `Detail ↗` (`fontSize: 12, Plus Jakarta Sans Medium, #0284C7`, tanpa background fill) di pojok kanan atas kartu (`x: 334, y: 14`), selaras dengan Mobile.
      - Posisi kerja membentang di baris 2 (`x: 16, y: 56, w: 378`).
      - Baris bawah seimbang (*flex-between*): Rentang gaji di kiri bawah (`Rp 15.000.000 - 20.000.000`, teks slate `#334155`) sejajar dengan tanggal dilamar di kanan bawah (`Dilamar: 10 Nov 2026`, `textAlign: right`).
      1. `Shopee Indonesia` (Selected — border biru `#0284C7`, avatar inisial `S`, tombol `Detail ↗` pojok kanan atas, badge "Sedang Dibaca" ditiadakan).
      2. `Blibli` (UI Engineer, avatar inisial `B`, tombol `Detail ↗`).
      3. `Dana Indonesia` (Frontend Engineer, avatar inisial `D`, tombol `Detail ↗`).
      4. `Tiket.com` (React Native Engineer, avatar inisial `T`, tombol `Detail ↗`).
    * Tombol garis putus-putus penuh: `+ Tambah Lamaran Baru ke Folder Applied` (`h: 44, y: 656, fontStyle: Regular`).
  * **Sisi Kanan (x: 912, w: 480) — Persistent Inspector Panel (`y: 344, h: 520`):**
    * Kartu kaca solid (`bg-white/85, backdrop-blur-xl, border border-white/90, rounded-3xl`).
    * Header lamaran: Logo bulat Shopee Indonesia dengan inisial `S` + Judul Posisi (Software Engineer - Web • Jakarta Selatan) + Badge `Status: Applied`.
    * 3-Kolom Properties Grid: Rentang Gaji (Rp 15 - 20 Jt), Tipe Kerja (Full-time On-Site), Tanggal Dilamar (10 Nov 2026), Sumber Lamaran (LinkedIn Jobs), Kontak Recruiter (recruiter@shopee.co.id), Lokasi Kantor (Jakarta Selatan).
    * Arsip Snapshot JD Permanen: Judul `Deskripsi Pekerjaan` dilengkapi pill kuning neon **`Kecocokan CV: 84%`** (`bg: #D4FF47`, teks `#0C4A6E`) sejajar kanan di atas kontainer deskripsi tugas Shopee (dihitung oleh `pgvector`, 0 token AI), sehingga area `Kualifikasi Kunci Terdeteksi` dan chips (`React`, `Next.js`, `TypeScript`, `REST API`) tetap bersih, dan kartu daftar di sisi kiri tetap tanpa badge skor.
    * **Komponen Radio Selector Transisi Status (`y: 400, h: 56`):**
      - Judul `Ubah Status Lamaran:` dalam warna slate gelap `#0F172A` (tidak ikut biru).
      - Pilihan radio status didistribusikan secara rata (**justify-between**) sepanjang kontainer: `(•) Applied` (warna biru `#0284C7`), `( ) Interview`, `( ) Offered`, `( ) Rejected` (warna netral slate), mengeliminasi area kosong di sisi kanan.
    * Tombol Aksi Bawah: `Edit` (Primary blue) dan `Salin Draf Follow-Up (H+7) ↗` (Ghost blue).

---

### C. Tablet (834x1194) — 5-Folder Hub & Split Master-Detail
* **Top Navbar Tablet (`w: 786, h: 58`, y: 20):** Tab `Roles` aktif, brand text Regular.
* **Header Bar (y: 98):** Judul "Papan Lamaran" (`fontStyle: Regular`) + Subtitle.
* **Kontrol Header Tablet:**
  * **Tombol `⤓ PDF` (`w: 88, h: 44`, x: 442, y: 100):** Tombol ringkas icon unduh + PDF dengan border `#BAE6FD` dan teks `#0284C7`.
  * Search Bar Pill (`w: 214, h: 44`, x: 540) + Filter Button (`w: 44, h: 44`, x: 766).
* **5 Folder Status Cards Ikigai (y: 160 s.d. 304, w: 148 masing-masing, gap: 11, h: 144):**
  * Folder `Applied` aktif dengan visual gradient biru menyala (`#38BDF8` → `#0284C7`), teks putih, dan elevasi glowing.
  * 4 folder lainnya (`Follow-Up`, `Interview`, `Offered`, `Rejected`) bersih dengan nuansa putih `#F8FAFC`.
* **Konten Bawah (y: 324 s.d. 1160):**
  * **Sisi Kiri (x: 24, w: 420) — Vertical Cards Feed:**
    * Header seksi: **`Daftar Lamaran: Applied`** (`fontSize: 15, fontFamily: Plus Jakarta Sans, fontStyle: SemiBold, #0F172A`) + `(12 Lamaran)` (`fontSize: 15, fontFamily: Plus Jakarta Sans, fontStyle: Regular, #64748B`).
    * Subtitle: "Pilih kartu di bawah untuk melihat arsip lengkap & kelola status".
    * 3 Kartu terpilih ($420 \times 116$ px):
      - Avatar foto otomatis berbasis inisial (`S`, `B`, `D`) dengan bg gradasi langit-ke-awan (`#BAE6FD` → `#F0F9FF`).
      - **Tombol CTA Pojok Kanan Atas:** Text button bersih `Detail ↗` (`fontSize: 12, Plus Jakarta Sans Medium, #0284C7`, tanpa background fill) di pojok kanan atas kartu (`x: 344, y: 14`), selaras dengan Mobile.
      - Posisi kerja membentang di baris 2 (`x: 16, y: 56, w: 388`).
      - Baris bawah seimbang (*flex-between*): Rentang gaji di kiri bawah (`Rp 15.000.000 - 20.000.000`, teks slate `#334155`) sejajar dengan tanggal dilamar di kanan bawah (`Dilamar: 10 Nov 2026`, `textAlign: right`).
      1. `Shopee Indonesia` (Selected — border biru `#0284C7`, avatar inisial `S`, tombol `Detail ↗` pojok kanan atas, badge "Sedang Dibaca" ditiadakan).
      2. `Blibli` (avatar inisial `B`, tombol CTA `Detail ↗`).
      3. `Dana Indonesia` (avatar inisial `D`, tombol CTA `Detail ↗`).
    * Tombol `+ Tambah Lamaran Baru ke Folder Applied` (`h: 44, y: 768, fontStyle: Regular`).
  * **Sisi Kanan (x: 460, w: 350) — Persistent Inspector Panel (`y: 324, h: 640`):**
    * Header perusahaan Shopee dengan inisial `S` + badge Applied.
    * 2-Kolom Properti Data (Gaji, Tipe Kerja, Tanggal Dilamar, Sumber, Kontak HR, Lokasi Kantor).
    * Judul `Deskripsi Pekerjaan` disertai pill kuning neon **`Kecocokan CV: 84%`** (`bg: #D4FF47`, teks `#0C4A6E`) sejajar kanan di atas Arsip Snapshot JD permanen + Chips kualifikasi (`React`, `Next.js`, `TypeScript`).
    * Komponen Radio Group Status: Judul `Ubah Status Lamaran:` dalam slate gelap `#0F172A`, radio `(•) Applied` biru `#0284C7`, opsi `Interview`, `Offered`, `Rejected` terdistribusi seimbang (**justify-between**) rata margin kiri-kanan.
    * Tombol aksi: `Edit` (Primary blue) dan `Salin Draf Follow-Up ↗`.

---

### D. Mobile (390x844, `cornerRadius: 36px`, `clip: true`) — 2-Row Folder Grid Layout & Single-Feed Cards
* **Top Header (y: 18 s.d. 56):**
  * Logo resmi NextRole + brand text di sisi kiri (`x: 20, y: 18`, Poppins Regular 18).
  * Header bernapas lega tanpa tombol lebar yang memadati area atas.
* **Baris Pencarian & Unduh PDF Bersebelahan (y: 68, h: 44):**
  * **Search Input Bar (`w: 296, h: 44`, x: 20):** Pill putih dengan placeholder `Cari perusahaan atau posisi...` dan tombol filter di sisi kanan dalam bar (`x: 254`).
  * **Tombol `[icon PDF]` (`w: 44, h: 44`, x: 326):** Tombol aksi kompak bersebelahan dengan search bar (`bg: #F0F9FF`, border `#BAE6FD`, rounded-xl) memuat ikon dokumen PDF dan simbol unduh (`⤓ PDF`) 1-tap.
* **Jarak Spacing Lapang (Padding 20px):**
  * Terdapat jeda vertikal sebesar **`20px`** (dari $y = 112$ hingga $y = 132$) antara baris pencarian dan folder kategori, menghilangkan kesan berdempetan secara total.
* **2-Row Folder Grid Taller & Dimensional (y: 132 s.d. 334, w: 350, h: 202):**
  * **Baris 1 (Tinggi `104px`, y: 0):**
    * *Kiri (Lebar `w: 220`):* Folder `Applied` (**Aktif Biru Langit** `#38BDF8` → `#0284C7`, teks putih, dokumen saku mengintip dengan garis dokumen rapi, badge "Tahap Terkirim", elevasi glowing biru).
    * *Kanan (Kompak `w: 120`):* Folder `Follow-Up` (Putih `#F8FAFC`, teks `#0F172A`, count "2 lamaran", sub-meta "Tepat H+7").
  * **Baris 2 (Tinggi `88px`, y: 114):** 3 Folder berdimensi lapang berjajar horizontal (`w: 110` masing-masing, gap 10px, nuansa putih `#F8FAFC`):
    * `Interview` (3 lamaran • Berjalan)
    * `Offered` (2 tawaran • Tahap Penawaran)
    * `Rejected` (2 arsip • Terarsip)
* **Card Feed (y: 350 s.d. 704):**
  * Judul seksi: **`Applied`** (`fontSize: 15, fontFamily: Plus Jakarta Sans, fontStyle: SemiBold, #0F172A`) + `(12 Lamaran)` (`fontSize: 15, fontFamily: Plus Jakarta Sans, fontStyle: Regular, #64748B`).
  * 3 Kartu vertikal lamaran Applied bertingkat ($350 \times 102$ px, jarak gap 10px):
    - Foto profil otomatis berbasis inisial (`S`, `B`, `D`) dengan bg gradasi langit-ke-awan (`#BAE6FD` → `#F0F9FF`) dan border `#BAE6FD`.
    - **Tombol CTA Pojok Kanan Atas:** Text button bersih `Detail ↗` (`fontSize: 12, Plus Jakarta Sans Medium, #0284C7`, tanpa background fill) di pojok kanan atas kartu (`x: 276, y: 18`).
    - Posisi kerja membentang penuh di baris 2 (`x: 14, y: 54, w: 320`).
    - Baris bawah seimbang (*flex-between*): Rentang gaji di kiri bawah (`Rp 15.000.000 - 20.000.000`) dan tanggal dilamar di kanan bawah (`Dilamar: 10 Nov 2026`, `textAlign: right`).
    1. `Shopee Indonesia` (`y: 378`, Software Engineer - Web, avatar `S`, text action `Detail ↗`).
    2. `Blibli` (`y: 490`, UI Engineer, avatar `B`, text action `Detail ↗`).
    3. `Dana Indonesia` (`y: 602`, Frontend Engineer, avatar `D`, text action `Detail ↗`).
  * Kartu berakhir di `y: 704`, memberikan jarak aman bernapas `30px` sebelum tombol Raised FAB (`y: 734`) dan dock navigasi (`y: 756`).
* **Floating Bottom Pill Nav Dock (`h: 68`, y: 756):**
  * Menu `Roles` aktif dengan soft blue pill highlight (`#E0F2FE` + `#0284C7`) dengan label navigasi 10px Regular rata tengah serta ikon grafik batang untuk `Analytics`.
  * Raised FAB Catat Lamaran (+) 56x56 di tengah (`y: 734`).

### E. Detail Lamaran — Mobile Bottom Sheet (390x844, `cornerRadius: 36px`)
* **Raised Company Avatar (`64x64`, `y: -32`):** Menggunakan gradasi biru langit lembut (`#BAE6FD` → `#F0F9FF`) dan inisial perusahaan (`T` untuk Tokopedia).
* **3-Tab Segmented Control (`w: 350, h: 44`, y: 120):** Memuat 3 tab dengan istilah umum yang lugas: `Ringkasan` (aktif), `Deskripsi`, dan `Follow-Up`.
* **3-Column Info Strip (`w: 350, h: 66`, y: 174):** Tipe Kerja (`Hybrid`), Lokasi Kerja (`Jakarta Selatan`), Status Kanban (`Applied`).
* **Sumber Lowongan Bar (`w: 350, h: 40`, y: 250):** Bar dokumentasi sumber portal dan tautan loker asli (`Sumber: LinkedIn` di kiri dan `linkedin.com/jobs/view/3948102 ↗` di kanan).
* **Deskripsi Pekerjaan (`w: 350, h: 104`, y: 326):** Judul `Deskripsi Pekerjaan` disertai pill kuning neon **`Kecocokan CV: 84%`** (`bg: #D4FF47`, teks `#0C4A6E`) sejajar kanan di atas kontainer abu-abu netral (`#F8FAFC`, border `#E2E8F0`, radius `12px`/`14px`).
* **Kualifikasi Kunci Terdeteksi (`y: 464`):** Chips netral (`#F1F5F9`, border `#E2E8F0`, teks `#334155`) untuk kata kunci utama (*Next.js*, *TypeScript*, *Core Web Vitals*, *REST API*).
* **Ringkasan Timeline & CTA (`y: 498` s.d. `y: 612`):** Kartu ringkas `Tanggal Melamar` (`7 Hari Lalu`) dan `Tindak Lanjut` (`H+7 Hari Ini`), diikuti tombol utama `Draf Pesan HRD ↗`.

### F. Modal Catat Lamaran Baru — Manual & Smart Clipper (390x844)
* **Mode Manual (`4073`):** Memuat input Nama Perusahaan, Posisi / Role Lowongan, Tipe Kerja (`Remote`, `Hybrid`, `On-Site`), Perkiraan Rentang Gaji (Opsional), **Sumber Lowongan (Opsional)** berupa 4 pill cepat (`LinkedIn`, `JobStreet`, `Glints`, `Lainnya`) + input **Tautan Lowongan (Opsional)**, dan Deskripsi Pekerjaan & Kualifikasi.
* **Mode Otomatis AI (`3963`):** Mendukung unggah screenshot gambar maupun PDF serta tempel URL lowongan; AI/parser mengekstrak sumber portal otomatis dari domain tautan atau petunjuk visual screenshot. Status pill kuota menampilkan `Sisa Kuota: 18 / 20 klip hari ini • Gemini 3.5 Flash Lite`.

---

## 6. Spesifikasi Tata Letak Halaman Analitik & Performa Karir (Desktop, Tablet, Mobile)

Halaman Analitik dirancang 100% berfokus pada evaluasi performa pencarian kerja berbasis data historis lamaran (`Application` schema pada TSD), bebas dari duplikasi konten halaman *Home* (reminder jadwal) maupun *Roles* (daftar lamaran aktif, kontak recruiter, log aktivitas harian, dan tombol catat di dalam kartu): konversi pipeline, efektivitas portal sumber lamaran, kecepatan respon HRD, lead time antar-tahapan, analisis preferensi kerja & gaji, serta tren kualifikasi paling sering diminta.

### A. Prinsip UI & Minimalist Glassmorphism Analitik
* **Zero OS Emoji, Zero Duplication & Light Typography:** Seluruh emoji default, elemen transaksional *Home/Roles*, serta penggunaan bobot `Bold` yang berat ditiadakan. Tipografi selaras dengan halaman *Home*: menggunakan `Poppins Regular` untuk judul halaman dan angka KPI besar (`5.4 Hari`, `33.3%`, `10.0 Hari`), serta `Medium` seperlunya untuk judul kartu dan label sorotan.
* **Color Triad (Biru, Putih, Kuning Neon):** Mengikuti identitas resmi NextRole pada halaman *Authentication* & *Home* tanpa blok hitam pekat (`#0F172A` hanya untuk teks judul): biru langit (`#38A9E8` $\rightarrow$ `#0284C7` / `#0369A1`), kaca putih frosted (`#FFFFFFE0`), dan aksen kuning neon (`#D4FF47` dengan teks `#0C4A6E` / latar biru) pada indikator callout penting.
* **Borderless Frosted Glass Containers:** Semua kartu analitik menggunakan kaca semi-transparan putih lembut (`#FFFFFFE0` / `#FFFFFFDE`), highlight rim putih tipis (`#FFFFFFF5`, `1.5px`), `cornerRadius: 20px`, dan bayangan difus halus (`0 8px 24px rgba(15, 23, 42, 0.04)`) di atas kanvas gradien biru-slate lembut (`#F2F7FD` $\rightarrow$ `#E6F0FA`).
* **Weightless Nested Surfaces & Micro-Pills:** Tile di dalam kartu (*lead time tahapan*, pill rasio/benchmark) menggunakan latar transparan lembut (`#F1F5F999` / `#F8FAFC99`) tanpa border keras. Aksi sekunder memakai kapsul mikro netral (`4 Minggu`, `18 Aktif`, `Siklus Aktif`, `Semua Role`, `Dari 18 JD`).
* **Soft Alpha-Fade & Ghost Bar Charts:**
  * Bar chart *Efektivitas Portal Sumber* memadukan batang latar transparan (*ghost bar* untuk total lamaran terkirim) dengan batang sorotan berujung membulat dan gradasi vertikal memudar (`#0284C7` $\rightarrow$ `#38BDF833` untuk portal unggulan, slate lembut untuk portal lain), garis benchmark horizontal putus-putus, serta sky-blue tooltip pill (`#0284C7` $\rightarrow$ `#0369A1`) dengan highlight teks kuning neon (`#D4FF47`) untuk judul portal (`LinkedIn (50%)`).
  * Area spline chart *Kecepatan Respon HRD* dilengkapi *area gradient fill* biru langit lembut (`#38BDF847` $\rightarrow$ `#38BDF800`) dan floating callout pill kuning neon (`#D4FF47`, teks `#0C4A6E`) untuk metrik minggu terbaru (`4.8h (Mg 4)`).

### B. Desktop (1440x900) — 6-Card Pure Analytics Bento Grid
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Analytics` aktif dengan kapsul biru (`#0284C7`), logo resmi `nextrole`, badge kuota AI `18/20 Kuota AI`, tombol `+ Catat Lamaran`, dan avatar profil `BS` (tab ke-4 `Profile`).
* **Header & Controls:** Judul "Analitik & Performa Karir" (`Poppins Regular 24px`) + subtitle "Analisis efektivitas portal sumber, rasio konversi tahapan, dan tren kualifikasi lowongan", period selector `30 Hari Terakhir ▾`, dan tombol `Unduh Laporan`.
* **Analytical Filter Chips:** `Semua Lamaran (18)` (aktif gradien biru langit `#38A9E8` $\rightarrow$ `#0284C7`, teks putih), `3 Bulan Terakhir`, `Hybrid & Remote`, `Gaji ≥ 20 Jt`.
* **Row 1 — 3 Kartu Metrik Proses & Konversi (y: 210, h: 276):**
  1. **Kecepatan Respon HRD:** Metrik `5.4 Hari` + pill benchmark `-1.8h vs industri` + area spline chart 4 minggu dengan callout kuning neon `4.8h (Mg 4)`.
  2. **Konversi Pipeline:** Metrik `33.3% Lolos wawancara (6/18 loker)` dengan 4 horizontal ratio bars (`#94A3B8`, `#7DD3FC`, `#0EA5E9`, `#0369A1`): `Terkirim (Applied)` (18 / 100%), `Tahap Follow-Up H+7` (5 / 27.8%), `Lolos Wawancara` (6 / 33.3%), dan `Penawaran Final (Offer)` (2 / 11.1%).
  3. **Lead Time Tahapan:** Total rata-rata `10.0 Hari` dengan 3 nested tile durasi rata-rata: `Applied -> Respon Pertama` (`4.2 Hari`), `Screening -> Wawancara` (`3.1 Hari`), dan `Wawancara -> Offering` (`2.7 Hari`, bar `#0369A1`).
* **Row 2 — 3 Kartu Analisis Sumber, Gaji & Skill (y: 506, h: 368):**
  4. **Preferensi & Gaji:** Rata-rata Rentang Gaji Target `Rp 18 - 26 Jt` (dari 15 loker yang mencantumkan nominal gaji) + breakdown `Respon per Tipe Kerja` (`Hybrid`: 10 loker / 40% respon, `Remote`: 5 loker / 20% respon, `On-Site`: 3 loker / 33% respon).
  5. **Efektivitas Portal Sumber:** Dual-layer ghost & gradient bar chart (`LinkedIn`, `JobStreet`, `Glints`, `TechInAsia`, `Direct`), legenda `Terkirim` vs `Lolos Respon`, garis rata-rata putus-putus, dan sky-blue tooltip pill beraksen kuning neon `LinkedIn (50%) • 8 lamaran terkirim • 4 lolos respon`.
  6. **Kualifikasi Diminta:** Daftar 5 skill teratas yang diekstrak dari `keyRequirements` (`TypeScript` 78%, `React / Next.js` 72%, `REST API / GraphQL` 56%, `Tailwind CSS` 50%, `Unit Testing (Jest)` 28%).

### C. Tablet (834x1194) — 3-Row 2-Kolom Balanced Bento
* **Top Floating Navbar Tablet & Header:** Tab `Analytics` aktif + judul "Analitik & Performa Karir" (`Poppins Regular 22px`) + period selector `30 Hari Terakhir ▾` + tombol `Unduh Laporan` + analytical filter chips (`Semua Lamaran (18)` gradien biru langit, `3 Bulan Terakhir`, `Hybrid & Remote`, `Gaji ≥ 20 Jt`).
* **Row 1 (y: 198 s.d. 472):** 2 kolom berdampingan — **Kecepatan Respon HRD** dan **Konversi Pipeline**.
* **Row 2 (y: 490 s.d. 832):** 2 kolom berdampingan — **Efektivitas Portal Sumber** (lengkap dengan dual ghost/gradient bars dan sky-blue tooltip pill beraksen kuning neon `LinkedIn (50%) • 8 terkirim • 4 respon`) dan **Kualifikasi Diminta**.
* **Row 3 (y: 850 s.d. 1150):** 2 kolom berdampingan — **Lead Time Tahapan** dan **Preferensi & Gaji**.

### D. Mobile (390x844, `cornerRadius: 36px`, `clip: true`) — Airy 3-Block Feed & Swipeable KPI Peek
* **Top Header Bar, Title & Filter Chips (`y: 16..154`):** Brand `nextrole`, period selector `30 Hari Terakhir ▾`, tombol unduh laporan, judul "Analitik & Performa Karir" (`Poppins Regular 19px`), dan strip filter (`Semua (18)`, `3 Bulan`, `Hybrid`, `Gaji ≥ 20 Jt`).
* **Block 1 — Swipeable KPI Carousel (`y: 170, h: 120`):** Kartu horizontal lapang dengan *right-edge peek* agar bebas sesak: `Konversi Pipeline` (`33.3%`, progress segmented bar, `6 wawancara • 2 offer`), `Respon HRD` (`5.4 Hari`, pill kuning neon `-1.8h vs industri`, `Siklus: 10.0 hari`), dan peek `Target Gaji` (`Rp 18-26 Jt`, `Hybrid 40%`).
* **Block 2 — Card Efektivitas Portal Sumber (`y: 308, h: 202`):** Spasi vertikal `18px`, padding dalam `20px`, 4 batang portal lega (`LinkedIn`, `JobStreet`, `Glints`, `Direct`) dengan benchmark putus-putus dan pill biru-neon `LinkedIn 50%`.
* **Block 3 — Card Kualifikasi Paling Diminta (`y: 528, h: 180`):** Menampilkan 3 skill teratas (`TypeScript`, `React / Next.js`, `REST API / GraphQL`) secara lapang dan berhenti aman `48px` di atas dock (`y: 708`).
* **Floating Bottom Pill Nav Dock (`y: 756`):** Tab `Analytics` aktif dengan highlight pill biru muda (`#E0F2FE` + `#0284C7`), ikon user pada tab `Profile`, dan Raised Center FAB (64x64) ikon `+` putih untuk akses cepat pencatatan lamaran.

---

## 7. Spesifikasi Halaman Profile & Pengaturan Akun (Desktop, Tablet, Mobile)

Halaman ke-4 pada navigasi NextRole resmi diubah dari `Settings` menjadi **`Profile`** dengan memadukan kartu identitas pengguna dan daftar pengaturan terstruktur (*Account*, *Preferences*, *Data & Session*) dalam gaya **Soft Sky Glass** (Biru, Putih, Kuning Neon `#D4FF47`, tipografi ringan `Poppins Regular` & `Medium` tanpa `Bold`), seluruh item mengacu langsung pada entitas `User`, `Account`, dan fitur TSD tanpa jargon teknis internal. Foto profil seluruh layar menggunakan avatar karakter 3D berlatar putih bersih ([avatar-profile.jpg](file:///e:/project-nextjs/next-role/docs/avatar-profile.jpg)).

### A. Mobile (`390x844`, `cornerRadius: 36px`)
* **Header:** Judul terpusat `Profile` (`Poppins Regular 18px`, `y: 16`).
* **Profile Hero Banner Card (`w: 358, h: 220, y: 50`):**
  * Cover banner gradien biru langit (`h: 68`, `cornerRadius: 14`) dengan ornamen orb transparan.
  * Avatar 3D melingkar (`68x68`, ring putih `3.5px`) menimpa tepi bawah cover banner, nama `Budi Santoso` + badge centang biru terverifikasi, posisi `Fullstack Web Developer`, serta tombol ringkas **`Edit`** dengan ikon pensil di kanan.
  * **Baris Info `flex justify-between` (`y: 132`, jarak 2x di bawah posisi):** `[Pin] Jakarta Selatan, ID` rata kiri dan `[Mail] budi.santoso@gmail.com` rata kanan sejajar lebar kartu.
  * **Stat Strip 4-Kolom (`y: 170..208`):** Ringkasan metrik berpemisah garis vertikal tipis (`24 Lamaran | 06 Interview | 02 Offer | 68% Respon`).
* **Grouped Cards (`h: 156` max, baris `52px`, garis pemisah tipis `#F1F5F9`):**
  * **Account (`y: 300`, 3 item atau sub-baris ringkas di `Account`):** `Kuota AI Clipper` (pill kuning neon `18 / 20 klip`), **`Profil CV & Skill (PDF)`** (status file e.g. `CV_Budi.pdf` dengan aksi cepat `Preview` via Presigned URL R2 atau `Ubah`), serta `Akun Google & Keamanan` (aksi edit profil langsung lewat tombol **`Edit`** pada kartu hero agar tidak redundan).
  * **Preferences:** `Pengingat Follow-Up H+7` (toggle biru), `Bahasa Draf Pesan` (`ID / EN`).
  * **Data & Session:** `Ekspor & Arsip Data` (`CSV`), `Panduan NextRole`, `Keluar Akun` (`#BE123C`), tetap berhenti aman di atas Floating Bottom Pill Nav Dock (`y: 756`).
* **Floating Bottom Pill Nav Dock (`y: 756`):** Tab `Profile` aktif dengan highlight `#E0F2FE` + `#0284C7` dan ikon user.

### B. Tablet (`834x1194`)
* **Top Floating Navbar (`w: 786, h: 58`):** Tab `Profile` aktif (`#0284C7`) beserta foto avatar 3D di pojok kanan.
* **Full-Width Profile Hero Banner Card (`w: 786, h: 296, y: 156`):**
  * Cover banner gradien biru langit (`h: 102`, `cornerRadius: 14`) dengan ornamen orb transparan.
  * Avatar profil 3D melingkar (`88x88`, ring putih `4px`) menimpa tepi bawah banner.
  * Nama `Budi Santoso` + badge centang biru terverifikasi, posisi target `Fullstack Web Developer`, lokasi `Jakarta Selatan, ID`, email `budi.santoso@gmail.com`, serta tombol **`Edit Profile`** di kanan.
  * **Stat Strip 4-Kolom (`y: 222..286`):** `24 Total Lamaran | 06 Wawancara | 02 Penawaran | 68% Tingkat Respon`.
* **Grid Simetris 2x2 Grouped Cards (`w: 382` per kolom, `y: 496` & `y: 670`):** `Account` (`Kuota AI Clipper`, **`Profil CV & Skill (PDF)`** dengan aksi `Preview` / `Ubah`, & `Akun Google & Keamanan`), `Preferences` (`Pengingat Follow-Up H+7` & `Bahasa Draf Pesan HRD`), `Data & Privacy` (`Ekspor Riwayat Lamaran` & `Pulihkan / Hapus Arsip`), dan `Session` (`Panduan NextRole` & `Keluar Akun`).
* **Banner Slider Informatif (`w: 786, h: 152, y: 834`):** Banner edukasi ringkas mengenai kesiapan arsip deskripsi pekerjaan saat dihubungi HRD mendadak (*"Arsip Kerja Siap Saat HRD Menelepon"*), lengkap dengan tombol CTA kuning neon `Buka Papan Roles ›`, ilustrasi 3D, dan indikator pagination slide.

### C. Desktop (`1440x900`)
* **Top Floating Pill Navbar (`w: 1344, h: 64`, `x: 48`):** Tab `Profile` aktif (`#0284C7`) beserta foto avatar 3D di pojok kanan.
* **50/50 Balanced Grid (`x: 48..1392`, `w: 1344`, sejajar penuh dengan padding horizontal navbar, gap tengah `28px`):**
  * **Kolom Kiri 1/2 (`x: 48, w: 658`):**
    1. **Profile Hero Banner Card (`y: 144, h: 352`):** Cover banner gradien biru langit (`h: 118`), avatar 3D (`92x92`, ring putih `4px`) menimpa tepi bawah cover, nama `Budi Santoso` + badge centang biru + pill `Google Terhubung`, posisi target `Fullstack Web Developer`, lokasi & email, tombol **`Edit Profile`** di kanan (`x: 508`), serta **Stat Strip 4-Kolom (`24 Total Lamaran | 06 Wawancara | 02 Penawaran | 68% Tingkat Respon`)**.
    2. **Banner Slider Informatif (`y: 524, h: 224`):** Banner tips persiapan panggilan HRD (*"Arsip Kerja Siap Saat HRD Menelepon"*), tombol kuning neon `Buka Papan Roles ›`, ilustrasi 3D, dan indikator pagination slide, rata bawah tepat di `y: 748`.
  * **Kolom Kanan 1/2 (`x: 734, w: 658`):** Seluruh 4 kelompok kartu terstruktur bertumpuk rapi (`Account`, `Preferences`, `Data & Privacy`, dan `Session`) rata bawah tepat di `y: 748`: `Account` memuat `Kuota Smart AI Clipper` + pill kuning neon `18 / 20 klip`, **`Profil CV & Skill (PDF)`** (`CV_Budi.pdf • Preview` + tombol ubah untuk R2 Private Bucket & `Gemini Embedding 2`), serta `Akun Google & Keamanan`; `Preferences` memuat `Pengingat Follow-Up Otomatis (H+7)` & `Bahasa Default Draf Pesan HRD`; `Data & Privacy` memuat `Ekspor Riwayat Lamaran & Arsip JD` & `Pulihkan / Bersihkan Arsip Terhapus`; dan `Session` memuat `Panduan Penggunaan NextRole` & `Keluar Akun`.
* **Modal / Sheet Kelola & Preview CV PDF (`Modal Kelola CV - Mobile 390x844`):** Memuat dropzone unggah PDF CV (maks 5 MB ke Private Bucket Cloudflare R2), kartu file aktif dengan tombol `Preview` (membuka PDF via Presigned URL sementara), pratinjau `Ringkasan Teks Terdeteksi` untuk pembaruan vektor `Gemini Embedding 2 (768d)`, serta tombol `Simpan & Perbarui`.


