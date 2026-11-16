# NextRole — Dokumen Desain & Panduan Gaya UI/UX
*Versi: 3.2.0 (Glassmorphic Bento & Symmetrical Balance Refactor)*

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
* **Neutral Slate:**
  * Title/Headings: `#0F172A` (Slate-900)
  * Body/Text: `#334155` (Slate-700)
  * Secondary/Muted: `#64748B` (Slate-500)
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
* **Perlu Tindak Lanjut Carousel (`y: 354, h: 102`):** Kartu horizontal kompak (`w: 280, h: 102`, selaras standar kartu Roles) memuat kotak inisial perusahaan (`38x38`), nama perusahaan & lokasi, link `Detail ↗`, posisi, rentang gaji biru `#0284C7`, dan keterangan waktu H+7 di kanan bawah (Tokopedia, peek Apple).
* **Aktivitas Terakhir Feed (`y: 476` s.d. `y: 720`):** Kartu vertikal kompak (`w: 350, h: 102`, selaras standar kartu Roles) untuk Grab Indonesia (`y: 504`) dan Shopee Indonesia (`y: 618`), berakhir aman di atas Floating Bottom Dock.
* **Floating Bottom Pill Nav Dock (`h: 68`, radius 28px):** 4 menu utama berbahasa Inggris (*Home*, *Roles*, *Analytics*, *Settings*) dengan ikon grafik batang untuk *Analytics* dan **Raised Center FAB (+)** untuk aksi *Catat Lamaran*.

---

### B. Tablet (768px – 1023px / 834x1194) — Top Floating Pill Navbar & 2-Kolom Seimbang
* **Top Floating Pill Navbar (`w: 786, h: 58`, radius 29px, y: 20):**
  * Kiri: Logo resmi NextRole + brand text `nextrole` (Courier New Bold, 18px).
  * Tengah: Pill navigasi terpadu (*Home* aktif, *Roles*, *Analytics*, *Settings*).
  * Kanan: Pill kuota harian `18/20 Klip`, tombol cepat `+`, dan avatar `BS` (32x32).
* **Banner Slider Tablet (`w: 786, h: 140`, y: 160):** Membentang penuh di atas konten.
* **Grid 2-Kolom (y: 324 s.d. y: 866 — Baseline-Locked di Y = 866):**
  * **Kolom Kiri (w: 454) — Perlu Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. 4 Kartu Lamaran selaras standar Roles (`h: 116`, gap `15px–16px`, radius `20px`, kotak logo inisial `40x40`, tombol `Detail ↗` pojok kanan atas, tanpa badge warna-warni): Tokopedia (`y: 356`), Bukalapak (`y: 487`), GoTo Financial (`y: 618`), dan Apple (`y: 750`, berakhir tepat di **Y = 866**).
  * **Kolom Kanan (w: 308) — Statistik Lamaran & Kalender Agenda:**
    1. Header "Statistik Lamaran" + link "Bulan Ini ›" (sebagai judul tunggal komponen tanpa duplikasi judul internal).
    2. Quick Analytics Bento Tablet (`h: 178`, `y: 356..534`): 4 kotak metrik simetris dengan ikon 3D squircle (Total Dilamar, Interview Aktif, Perlu Follow-Up, Tingkat Respon).
    3. Header "Kalender Agenda" + link "Buka ›" (`y: 550`).
    4. Mini Calendar Tablet (`h: 286`, `y: 580..866`, berakhir persis di **Y = 866**): Kalender November 2026 + jadwal agenda terpilih.
* **Pipeline Lamaran Grid 2x2 (y: 890 s.d. y: 1170):**
  * Header "Pipeline Lamaran" + link "Lihat semua ›" (`y: 890`).
  * Disusun dalam 2 baris x 2 kartu selaras standar kartu Roles (`w: 382, h: 116`):
    * Baris 1 (`y: 922`): **Grab Indonesia Tablet** (`x: 24`, `Interview: 13 Nov 2026`) & **Shopee Indonesia Tablet** (`x: 428`, `Dilamar: 10 Nov 2026`).
    * Baris 2 (`y: 1054`): **Traveloka Tablet** (`x: 24`, `Offering • 28 Okt 2026`) & **Dana Indonesia Tablet** (`x: 428`, `Dilamar: 12 Nov 2026`), berakhir simetris di **Y = 1170** (margin bawah 24px).

---

### C. Desktop (≥ 1024px / 1440x1000) — 3-Column Balanced Dashboard
* **Top Floating Pill Navbar (`w: 1344, h: 64`, radius 32px, y: 20):**
  * Kiri: Logo resmi NextRole (36x36) + brand `nextrole` (Courier New Bold, 18px).
  * Tengah: Segmented pill tabs (`Home`, `Roles`, `Analytics`, `Settings`).
  * Kanan: Kuota harian `18 / 20 Klip`, tombol utama `+ Catat Lamaran` (`w: 154, h: 36`), dan avatar `BS` (36x36).
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
    2. 3 Kartu Lamaran selaras standar Roles (`h: 116`, gap `16px`): Grab Indonesia (`y: 390`), Shopee Indonesia (`y: 522`), dan Traveloka (`y: 654`).
  * **Kolom 3 (x: 960, w: 432) — Kalender & Target Mingguan:**
    1. Mini Calendar Card (`h: 510`, berakhir di **Y = 950**):
       - Kalender interaktif November 2026.
       - Agenda & Wawancara Mendatang (Grab, Shopee, Tokopedia, Traveloka).
       - Widget Deterministik **"Target Lamaran Minggu Ini"**: Progress bar $80\%$ ($8/10$ lamaran tercapai), 0 token AI.

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
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Roles` aktif dengan kapsul biru (`#0284C7`), brand text `nextrole` (Poppins Regular).
* **Header Bar (y: 102):**
  * Judul "Papan Lamaran" (`fontSize: 26, fontStyle: Regular, #0F172A`).
  * Subtitle "Kelola 18 lamaran aktif terstruktur dalam 5 tahapan pipeline" (`fontSize: 14, #64748B`).
  * **Tombol `⤓ PDF` (`w: 88, h: 44`, x: 924, y: 104):** Tombol ringkas kaca putih dengan border `#BAE6FD` dan teks `#0284C7` format icon unduh + PDF.
  * Search bar pill (`w: 312, h: 44`, x: 1024) + filter square button (`w: 44, h: 44`, x: 1348), **sejajar presisi pada garis batas kanan $X = 1392$ px** bersama Navbar, Folder Rejected, dan Inspector Panel.
* **5 Folder Status Cards Ikigai (y: 168 s.d. 324, w: 252 masing-masing, gap: 21, h: 156):**
  * `Applied` (12 lamaran • Tahap terkirim — **Aktif** dengan gradasi langit `#38BDF8` → `#0284C7`, teks putih, dokumen mengintip di saku atas)
  * `Follow-Up Needed` (3 lamaran • 2 tepat H+7 • Inactive White `#F8FAFC`)
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
      - Baris bawah seimbang (*flex-between*): Rentang gaji di kiri bawah (`Rp 15.000.000 - 20.000.000`, teks biru `#0284C7`) sejajar dengan tanggal dilamar di kanan bawah (`Dilamar: 10 Nov 2026`, `textAlign: right`).
      1. `Shopee Indonesia` (Selected — border biru `#0284C7`, avatar inisial `S`, tombol `Detail ↗` pojok kanan atas, badge "Sedang Dibaca" ditiadakan).
      2. `Blibli` (UI Engineer, avatar inisial `B`, tombol `Detail ↗`).
      3. `Dana Indonesia` (Frontend Engineer, avatar inisial `D`, tombol `Detail ↗`).
      4. `Tiket.com` (React Native Engineer, avatar inisial `T`, tombol `Detail ↗`).
    * Tombol garis putus-putus penuh: `+ Tambah Lamaran Baru ke Folder Applied` (`h: 44, y: 656, fontStyle: Regular`).
  * **Sisi Kanan (x: 912, w: 480) — Persistent Inspector Panel (`y: 344, h: 520`):**
    * Kartu kaca solid (`bg-white/85, backdrop-blur-xl, border border-white/90, rounded-3xl`).
    * Header lamaran: Logo bulat Shopee Indonesia dengan inisial `S` + Judul Posisi (Software Engineer - Web • Jakarta Selatan) + Badge `Status: Applied`.
    * 3-Kolom Properties Grid: Rentang Gaji (Rp 15 - 20 Jt), Tipe Kerja (Full-time On-Site), Tanggal Dilamar (10 Nov 2026), Sumber Lamaran (LinkedIn Jobs), Kontak Recruiter (recruiter@shopee.co.id), Lokasi Kantor (Jakarta Selatan).
    * Arsip Snapshot JD Permanen: Kontainer teks abu-abu lembut memuat ringkasan deskripsi tugas Shopee.
    * Kualifikasi Kunci Terdeteksi: Chips badge (`React`, `Next.js`, `TypeScript`, `REST API`).
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
      - Baris bawah seimbang (*flex-between*): Rentang gaji di kiri bawah (`Rp 15.000.000 - 20.000.000`, teks biru `#0284C7`) sejajar dengan tanggal dilamar di kanan bawah (`Dilamar: 10 Nov 2026`, `textAlign: right`).
      1. `Shopee Indonesia` (Selected — border biru `#0284C7`, avatar inisial `S`, tombol `Detail ↗` pojok kanan atas, badge "Sedang Dibaca" ditiadakan).
      2. `Blibli` (avatar inisial `B`, tombol CTA `Detail ↗`).
      3. `Dana Indonesia` (avatar inisial `D`, tombol CTA `Detail ↗`).
    * Tombol `+ Tambah Lamaran Baru ke Folder Applied` (`h: 44, y: 768, fontStyle: Regular`).
  * **Sisi Kanan (x: 460, w: 350) — Persistent Inspector Panel (`y: 324, h: 640`):**
    * Header perusahaan Shopee dengan inisial `S` + badge Applied.
    * 2-Kolom Properti Data (Gaji, Tipe Kerja, Tanggal Dilamar, Sumber, Kontak HR, Lokasi Kantor).
    * Arsip Snapshot JD permanen + Chips kualifikasi (`React`, `Next.js`, `TypeScript`).
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
* **Deskripsi Pekerjaan (`w: 350, h: 104`, y: 326):** Kontainer abu-abu netral (`#F8FAFC`, border `#E2E8F0`, radius `12px`/`14px`) yang menampilkan poin-poin deskripsi dan tanggung jawab pekerjaan secara langsung tanpa label status redundan.
* **Kualifikasi Kunci Terdeteksi (`y: 464`):** Chips netral (`#F1F5F9`, border `#E2E8F0`, teks `#334155`) untuk kata kunci utama (*Next.js*, *TypeScript*, *Core Web Vitals*, *REST API*).
* **Ringkasan Timeline & CTA (`y: 498` s.d. `y: 612`):** Kartu ringkas `Tanggal Melamar` (`7 Hari Lalu`) dan `Tindak Lanjut` (`H+7 Hari Ini`), diikuti tombol utama `Draf Pesan HRD ↗`.

### F. Modal Catat Lamaran Baru — Manual & Smart Clipper (390x844)
* **Mode Manual (`4073`):** Memuat input Nama Perusahaan, Posisi / Role Lowongan, Tipe Kerja (`Remote`, `Hybrid`, `On-Site`), Perkiraan Rentang Gaji (Opsional), **Sumber Lowongan (Opsional)** berupa 4 pill cepat (`LinkedIn`, `JobStreet`, `Glints`, `Lainnya`) + input **Tautan Lowongan (Opsional)**, dan Deskripsi Pekerjaan & Kualifikasi.
* **Mode Otomatis AI (`3963`):** Mendukung unggah screenshot gambar maupun tempel URL lowongan; AI/parser mengekstrak sumber portal otomatis dari domain tautan atau petunjuk visual screenshot.

---

## 6. Spesifikasi Tata Letak Halaman Analitik & Performa Karir (Desktop, Tablet, Mobile)

Halaman Analitik dirancang untuk memberikan visibilitas performa pencarian kerja secara komprehensif, presisi, dan bebas dari ornamen berlebih (Anti-Slop): konversi pipeline dengan segmented funnel bar, efektivitas portal sumber lamaran (bar chart minimalis), kecepatan respon recruiter (line trend chart bersih), analisis lead time per tahapan, serta pantauan intensif lamaran aktif.

### A. Prinsip UI & Anti-Slop Analitik
* **Zero OS Emoji:** Seluruh emoji default ditiadakan secara ketat. Visual mengandalkan tipografi jelas, angka metrik tegas, dan garis indikator fungsional.
* **Unified Neutral Containers:** Semua kartu analitik menggunakan kontainer putih solid seragam (`bg: #FFFFFF`, border tipis `#E2E8F0`, cornerRadius 16px, bayangan halus `0 2px 8px rgba(15, 23, 42, 0.04)`). Mengeliminasi kartu biru neon maupun gradasi berwarna yang bertabrakan.
* **Monochrome & Single Accent System:** Seluruh status badge menggunakan palet netral seragam (`bg: #F1F5F9` / `#FFFFFF`, `border: #E2E8F0`, teks `slate-700 #334155`). Aksen Sky Blue (`#0284C7`) hanya digunakan sebagai penanda elemen aktif, tombol utama, atau bar sorotan utama.
* **Actionable & Data-Driven:** Mengeliminasi tips AI generik. Mengutamakan data nyata seperti lead time antar-tahap (rata-rata hari tunggu), conversion rate riil, dan pembaruan log recruiter.

### B. Desktop (1440x900) — Bento Grid Karir Minimalis
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Analytics` aktif dengan kapsul biru (`#0284C7`), logo resmi nextrole, badge kuota AI `18/20 Kuota AI`, tombol `+ Catat Lamaran`, dan avatar profil `BS`.
* **Header & Controls (y: 104 s.d. 136):**
  * Judul "Analitik & Performa Karir" (`Plus Jakarta Sans Bold 24px`) + Subtitle "Evaluasi konversi funnel lamaran, efektivitas portal sumber, dan kecepatan respon recruiter".
  * Period Selector Pill (`w: 170, h: 40`, x: 1046): Dropdown pilihan rentang waktu `30 Hari Terakhir ▾`.
  * Tombol `Unduh Laporan` (`w: 160, h: 40`, x: 1232): Tombol ekspor laporan analitik dalam format dokumen/PDF.
* **Filter Chips Row (y: 156, h: 34):**
  * Chip Aktif: `Semua Posisi (18)` (`bg: #0F172A`, teks putih).
  * Chip Netral: `Wawancara (6)`, `Follow-Up H+7 (2)`, `Offering (2)` (`bg: #FFFFFF`, border `#E2E8F0`, teks `#475569`).
* **Kolom Kiri Bento (`w: 848`, x: 48, y: 204 s.d. 876):**
  * **Card Pipeline & Konversi Lamaran (`w: 848, h: 184`, y: 204):**
    - Judul "Pipeline & Konversi Lamaran" + Subtitle + Badge Netral "Konversi: 33.3%".
    - Segmented Funnel Progress Bar (`h: 12`, radius 6px) proporsional: Applied (440px / `#94A3B8`), Interview (246px / `#0284C7`), Offered (114px / `#0F172A`).
    - 3 Blok Metrik Bersih di bawah bar: "18 Lamaran Terkirim", "6 Wawancara (33.3% Lolos)", "2 Penawaran (11.1% Offer Rate)".
  * **Baris Tengah Bento Berdampingan (`y: 408, h: 236`):**
    - **Card Efektivitas Saluran Lamaran (`w: 412`, x: 48):** Background putih bersih, gridlines halus, grafik batang minimalis (LinkedIn: 8 pos sorotan `#0284C7`, JobStreet: 5, Glints: 3, TechInAsia: 2, Direct: 1).
    - **Card Kecepatan Respon Recruiter (`w: 412`, x: 484):** Background putih seragam, metrik "5.4 Hari", subtext komparasi industri, dan grafik garis spline biru presisi dengan titik penanda minggu 1 s.d. 4.
  * **Card Lamaran dalam Pantauan Intensif (`w: 848, h: 216`, y: 660):**
    - Format tabel ringkas: Tokopedia (Wawancara User 18 Nov, Rp 18-25 jt), Tiket.com (Follow-Up H+7 Hari Ini, Rp 16-22 jt), Grab Indonesia (Offering Diterima, Rp 22-30 jt) dengan badge netral seragam dan link aksi langsung.
* **Kolom Kanan Bento (`w: 476`, x: 916, y: 204 s.d. 876):**
  * **Card Aktivitas Terkini Recruiter (`h: 320`, y: 204):** Timeline vertikal bersih dengan garis penghubung dan titik status (Gojek, Bukalapak, Grab, Traveloka).
  * **Card Target & Lead Time Pipeline (`h: 332`, y: 544):** Target mingguan 4/5 lamaran (80%), 2 boks metrik lead time ("Applied ➔ Wawancara: 4.2 Hari", "Wawancara ➔ Keputusan: 5.8 Hari"), kontak aktif recruiter, dan tombol "+ Catat Lamaran Baru".

### C. Tablet (834x1194) — 2-Kolom Balanced Bento
* **Top Floating Navbar Tablet (`w: 770, h: 64`, y: 20):** Tab `Analytics` aktif.
* **Header & Controls (y: 94 s.d. 122):** Judul "Analitik & Performa Karir" + Subtitle + Period Selector `30 Hari Terakhir ▾` + Tombol `Unduh Laporan`.
* **Filter Chips Row (y: 150, h: 32):** `Semua Posisi (18)` aktif gelap, `Wawancara (6)`, `Follow-Up (2)`, `Offering (2)` netral.
* **Card Pipeline & Konversi Tablet (`w: 786, h: 184`, y: 196):** Segmented funnel bar proporsional + 3 blok metrik horizontal.
* **Row 1 — 2-Kolom Berdampingan (`y: 396, h: 236`):**
  * Kiri (`w: 383`, x: 24): Card Efektivitas Saluran (Bar Chart putih bersih).
  * Kanan (`w: 383`, x: 427): Card Kecepatan Respon Recruiter (Line Chart putih bersih, 5.4 Hari).
* **Row 2 — 2-Kolom Berdampingan (`y: 648, h: 260`):**
  * Kiri (`w: 383`, x: 24): Card Target & Lead Time (Progress 80%, lead time 4.2h & 5.8h, tombol catat).
  * Kanan (`w: 383`, x: 427): Card Aktivitas Terkini (Timeline log Gojek, Bukalapak, Grab).
* **Row 3 — Full-Width Bottom (`w: 786, h: 220`, y: 924):**
  * Card Lamaran dalam Pantauan Intensif dengan 3 baris terstruktur dan badge netral seragam.

### D. Mobile (390x844, `cornerRadius: 36px`, `clip: true`) — Compact Vertical Bento & Floating Dock
* **Top Header Bar (`w: 358, h: 48`, y: 16):** Brand `nextrole` + Period pill `30 Hari Terakhir ▾` + Tombol unduh laporan `⤓`.
* **Title & Subtitle (y: 74 s.d. 98):** "Analitik & Performa Karir" + "Konversi funnel & kecepatan respon recruiter".
* **Card Pipeline & Konversi Mobile (`w: 358, h: 136`, y: 124):**
  * Segmented funnel bar (Applied, Interview, Offered) + 3 metrik ringkas di bawahnya.
* **Mobile 2-Card Row (`w: 358, h: 148`, y: 272):**
  * Kiri (`w: 173`, x: 16): Saluran Lamaran (3 bar saluran utama LinkedIn, JobStreet, Glints).
  * Kanan (`w: 173`, x: 201): Waktu Respon (5.4 Hari, grafik garis biru minimalis berlatar putih).
* **Card Target & Lead Time Mobile (`w: 358, h: 114`, y: 432):**
  * Progress target 80% + 2 stat boks lead time tahapan (4.2 hari & 5.8 hari).
* **Card Lamaran Pantauan Intensif Mobile (`w: 358, h: 186`, y: 558):**
  * 3 baris lamaran ringkas dengan logo inisial, rentang gaji, dan badge netral tanpa warna pelangi.
* **Floating Bottom Pill Nav Dock (`h: 68`, y: 756):**
  * Tab `Analytics` aktif dengan highlight pill biru muda (`#E0F2FE` + `#0284C7`) beserta ikon grafik batang.
  * Raised Center FAB (64x64) `+` di tengah terangkat `-translate-y-4` untuk aksi cepat catat lamaran.
  * Teks label navigasi 10px Regular rata tengah.


