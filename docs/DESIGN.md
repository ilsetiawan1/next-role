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

### A. Mobile (< 768px / 390x844)
* **Top Bar:** Header greeting ("Budi Santoso", Fullstack Web Developer) + search bar pill + filter modal trigger.
* **Horizontal Filters:** Pill scroll horizontal (*Semua*, *Full-time*, *Hybrid*, *Follow-Up*).
* **Banner AI Carousel (`w: 358, h: 140`):** Promosi fitur Smart AI Clipper dengan ilustrasi 3D.
* **Perlu Tindak Lanjut Feed:** Kartu vertikal dengan Hero Tokopedia (H+7), Bukalapak, GoTo Financial.
* **Floating Bottom Pill Nav Dock (`h: 68`, radius 28px):** 4 menu utama (*Home*, *Roles*, *Kalender*, *Settings*) dengan **Raised Center FAB (+)** terangkat `-translate-y-4` untuk aksi *Catat Lamaran*.

---

### B. Tablet (768px – 1023px / 834x1194) — Top Floating Pill Navbar & 2-Kolom Seimbang
* **Top Floating Pill Navbar (`w: 786, h: 58`, radius 29px, y: 20):**
  * Kiri: Logo resmi NextRole + brand text `nextrole` (Courier New Bold, 18px).
  * Tengah: Pill navigasi terpadu (`Home` aktif, `Roles`, `Kalender`, `Settings`).
  * Kanan: Pill kuota harian `18/20 Klip`, tombol cepat `+`, dan avatar `BS` (32x32).
* **Banner Slider Tablet (`w: 786, h: 140`, y: 160):** Membentang penuh di atas konten.
* **Grid 2-Kolom (y: 324 s.d. y: 910):**
  * **Kolom Kiri (w: 454) — Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. Hero Card Tokopedia (H+7) (`h: 196`): Padding button CTA $24$ px dari tepi kanan dan bawah, teks tombol rata tengah sempurna.
    3. Card Bukalapak (H+7) (`h: 160`)
    4. Card GoTo Financial (Follow-Up H+6) (`h: 166`, berakhir di **Y = 910**)
  * **Kolom Kanan (w: 308) — Statistik & Kalender Agenda:**
    1. Header "Statistik Lamaran" + link "Bulan Ini ›"
    2. Quick Analytics Bento Card (`h: 200`): 4 kotak metrik simetris dengan ikon 3D squircle (Total Dilamar, Interview Aktif, Perlu Follow-Up, Tingkat Respon), label berjarak aman dari tepi kanan, link "Detail ›" rata kanan presisi.
    3. Header "Kalender Agenda" + link "Buka ›"
    4. Mini Calendar Tablet (`h: 306`, berakhir persis di **Y = 910**): Kalender November 2026 + jadwal agenda terpilih.
* **Pipeline Lamaran Horizontal Row (y: 934 s.d. y: 1134):**
  * Header "Pipeline Lamaran" + link "Lihat semua ›"
  * Disusun dalam 2 kartu horizontal berdampingan:
    * **Grab Indonesia Tablet (`w: 382, h: 160`, x: 24):** Status "Interview Besok" & jadwal interview.
    * **Shopee Indonesia Tablet (`w: 382, h: 160`, x: 428):** Status "Applied" & review status.

---

### C. Desktop (≥ 1024px / 1440x1000) — 3-Column Balanced Dashboard
* **Top Floating Pill Navbar (`w: 1344, h: 64`, radius 32px, y: 20):**
  * Kiri: Logo resmi NextRole (36x36) + brand `nextrole` (Courier New Bold, 18px).
  * Tengah: Segmented pill tabs (`Home`, `Roles`, `Kalender`, `Settings`).
  * Kanan: Kuota harian `18 / 20 Klip`, tombol utama `+ Catat Lamaran` (`w: 154, h: 36`), dan avatar `BS` (36x36).
* **Baris Atas (y: 168):**
  * **Banner AI Carousel Desktop (`w: 888, h: 164`, x: 48):** Membentang lebar di atas Kolom 1 dan Kolom 2.
  * **Kolom 3 Kanan Atas (x: 960, w: 432):**
    * Header "Statistik & Kalender"
    * Quick Analytics Bento Card (`h: 220`): 4 tile metrik simetris ($188 \times 72$ px) dengan 4 ikon 3D glassmorphic seimbang, angka `#0F172A`, dan label `#64748B`. Link "Bulan Ini ›" rata kanan sejajar batas bento box ($x = 414$).
* **Baris Bawah (y: 356 s.d. y: 950 — Terkunci Baseline Y = 950):**
  * **Kolom 1 (x: 48, w: 432) — Perlu Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. Hero Card Tokopedia (H+7) (`h: 200`): CTA button memiliki padding aman $24$ px kanan & bawah.
    3. Card Bukalapak (H+7) (`h: 160`)
    4. Card GoTo Financial (Follow-Up H+6) (`h: 168`, berakhir di **Y = 950**)
  * **Kolom 2 (x: 504, w: 432) — Pipeline Lamaran:**
    1. Header "Pipeline Lamaran" + link "Lihat semua ›"
    2. Card Grab Indonesia (`h: 168`)
    3. Card Shopee Indonesia (`h: 168`)
    4. Card Traveloka (Offering) (`h: 168`, berakhir di **Y = 950**): Menampilkan tag status Offering dan CTA "Review Offer ↗". Mengeliminasi *white space* kolom tengah.
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

### D. Mobile (390x844) — 2-Row Folder Grid Layout & Single-Feed Cards
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
  * Menu `Roles` aktif dengan soft blue pill highlight (`#E0F2FE` + `#0284C7`) + Raised FAB Catat Lamaran (+) 56x56 di tengah (`y: 734`).
  * Label navigasi 10px Regular (400) rata tengah.
* **Floating Bottom Pill Nav Dock (`h: 68`, y: 756):**
  * Menu `Roles` aktif dengan soft blue pill highlight (`#E0F2FE` + `#0284C7`) + Raised FAB Catat Lamaran (+) 56x56 di tengah (`y: 734`).
  * Label navigasi 10px Regular (400) rata tengah.

---

## 6. Spesifikasi Tata Letak Halaman Kalender & Agenda (Desktop, Tablet, Mobile)

Halaman Kalender dirancang untuk memberikan transparansi penuh jadwal pencarian kerja: jadwal wawancara terdekat, batas respons offering, dan pengingat otomatis follow-up H+7 dengan aksi dokumentasi dan pelacakan lamaran 1-click.

### A. Prinsip UI & Anti-Slop Kalender
* **Zero OS Emoji:** Seluruh emoji default bawaan sistem operasi (`⏱`, `⚡`, `🗓`, `⏳`, `📅`, `⚙`, `⚠️`) ditiadakan. Navigasi dan indikator status menggunakan ikon vektor autentik yang seragam dan teks informatif bersih.
* **Muted Badges (Kurangi Badge Warna-Warni):** Badge status agenda menggunakan palet warna netral yang tenang (`bg: #F1F5F9` / `#F8FAFC`, `border: #E2E8F0`, `text: #475569`), menghindari distraksi visual berlebih agar mata pengguna tetap fokus pada prioritas agenda.
* **Dokumentasi & Pelacakan Lamaran (Bukan Video Call CTA):** Menghilangkan tombol aksi pihak ketiga seperti "Masuk Google Meet / Zoom" karena NextRole berfokus sebagai platform dokumentasi lamaran. Tombol aksi difokuskan ke: `Detail Lamaran ↗`, `Snapshot JD ↗`, `Draf Pesan Follow-Up ↗`, dan `Review Penawaran ↗`.

### B. Desktop (1440x900) — Split Calendar Grid & Agenda Inspector
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Kalender` aktif dengan kapsul biru (`#0284C7`), logo resmi nextrole, badge kuota AI `18/20`, tombol `+ Catat Lamaran`, dan avatar pengguna.
* **Header & Controls (y: 104 s.d. 138):**
  * Judul "Jadwal & Agenda" + Subtitle "Pantau wawancara, deadline penawaran, dan pengingat follow-up H+7".
  * Navigasi Bulan (`‹ November 2026 ›`), tombol `Hari Ini`, View Switcher segmented (`Bulan` aktif / `Minggu`), dan tombol aksi cepat `+`.
* **Filter Chips Carousel (y: 156, h: 32):** Chips filter agenda horizontal (`Semua Agenda (6)`, `Wawancara (2)`, `Follow-Up H+7 (2)`, `Offering (2)`).
* **Calendar Grid Box (`w: 848, h: 672`, x: 48, y: 204):**
  * 7 Kolom Hari (`Sen` s.d. `Min` 112px) + 35 Tanggal Matrix (Okt 26 s.d. Nov 29).
  * Hari Aktif (Jum, 13 Nov): Glowing Blue Ring (`#0284C7` 2px), date circle biru, pill netral 14:00 Grab, Tokopedia H+7, dan indikator `+1 lainnya`.
  * Event Badges pada Cell 10 (Shopee), Cell 14 (Mekari), Cell 15 (Traveloka), dan Cell 18 (Blibli) bernuansa muted slate yang bersih.
* **Agenda Inspector Box (`w: 480, h: 672`, x: 912, y: 204):**
  * **Hero Grab Interview Card (h: 236):** Logo Grab hijau, badge netral `Wawancara User`, jadwal terstruktur "Jadwal: 14:00 - 15:00 WIB • Tinjau Dokumen Pendukung", tombol `Detail Lamaran ↗`, tombol `Snapshot JD ↗`, dan tombol `Detail ↗`.
  * **Tokopedia Follow-Up Card (h: 216):** Logo Tokopedia, badge netral `Perlu Follow-Up`, deskripsi status "Status: 7 hari tanpa kabar pasca Technical Test. Disarankan kirim follow-up.", tombol `Draf Pesan Follow-Up ↗`, dan tombol `Lihat Snapshot JD ↗`.
  * **Upcoming 7 Days Strip (h: 120):** Mini agenda mendatang (Mekari 14 Nov, Traveloka 15 Nov, Blibli 18 Nov) dengan tipografi slate elegan.

### C. Tablet (834x1194) — Month Grid & 2-Kolom Balanced Bento Inspector
* **Top Navbar Tablet (`w: 786, h: 58`, y: 20):** Tab `Kalender` aktif.
* **Header Bar (y: 94):** Judul "Jadwal & Agenda" + Subtitle + Navigasi Bulan `‹ November 2026 ›` + Tombol `Hari Ini` + Tombol `+`.
* **Filter Chips Row (y: 150, h: 32):** Chips status agenda (`Semua (6)`, `Wawancara (2)`, `Follow-Up (2)`, `Offering (2)`).
* **Calendar Grid Box Tablet (`w: 786, h: 466`, y: 196):**
  * 7 Kolom Hari (`Sen` s.d. `Min` 104px) + 35 Sel Tanggal kompak (76px tinggi).
  * Hari Aktif (Jum, 13 Nov): Highlight lembut biru, badge Grab 14:00, badge Tokopedia H+7.
* **Row 2 — 2-Kolom Bento Inspector (y: 682 s.d. 1168, h: 486):**
  * **Kolom Kiri (`w: 382`, x: 24) — Agenda Terpilih (13 Nov):** Hero Grab Card (badge `Wawancara User`, detail pewawancara, jadwal tinjau dokumen, tombol `Detail Lamaran ↗` + `Snapshot JD ↗`) + Tokopedia Card (badge `Perlu Follow-Up`, tombol `Draf Pesan Follow-Up ↗` + `Lihat JD ↗`).
  * **Kolom Kanan (`w: 382`, x: 428) — Agenda Mendatang (7 Hari):** 3 kartu agenda mendatang dengan badge netral dan tombol terarah (`Mekari` - `Detail Lamaran ↗`, `Traveloka` - `Review Penawaran ↗`, `Blibli` - `Detail Lamaran ↗`).

### D. Mobile (390x844) — Weekly Date Strip & Agenda Action Feed
* **Top Floating Header (`w: 358, h: 48`, y: 16):** Brand logo `nextrole` monospace + Month pill `‹ November 2026 ›` + tombol aksi cepat `+`.
* **Horizontal Weekly Date Strip (`w: 358, h: 76`, y: 72):**
  * 7 hari berjalan (Sen 9 s.d. Min 15 Nov) dalam kapsul sentuh responsif.
  * Hari ini (Jum 13 Nov) aktif dengan warna biru cerah (`#0284C7`), angka tanggal kontras putih, dan dot indikator tunggal yang rapi.
* **Filter Chips Carousel (y: 156, h: 32):** Chips status agenda horizontal (`Semua (6)`, `Wawancara (2)`, `Follow-Up (2)`, `Offering (2)`).
* **Agenda Action Feed (y: 198 s.d. 744):**
  * **Hero Grab Card (h: 188):** Logo Grab hijau, badge netral `Wawancara User`, info jadwal terstruktur, tombol `Detail Lamaran ↗` + tombol `Snapshot JD ↗`.
  * **Tokopedia Card (h: 182):** Logo Tokopedia hijau, badge netral `Perlu Follow-Up`, ringkasan status 7 hari, tombol `Draf Pesan Follow-Up ↗` + tombol `Lihat JD ↗`.
  * **Mekari Card (h: 76):** Wawancara HR Besok 10:00 WIB + tombol `Detail ↗`.
  * **Traveloka Card (h: 76):** Batas Offering Minggu 15 Nov + tombol `Review ↗`.
* **Floating Bottom Pill Nav Dock (`h: 68`, y: 756):**
  * Ikon vektor autentik: Menggunakan layer `VECTOR` asli (Home, Roles, Kalender, Settings) dengan bobot garis 1.5px tanpa menggunakan karakter emoji Unicode.
  * Menu `Kalender` aktif dengan soft blue pill highlight (`#E0F2FE` + `#0284C7`) + Raised FAB Catat Lamaran (+) 64x64 di tengah.
  * Seluruh label teks navigasi berukuran **10px (`text-[10px]` / `2xs`)**, bobot **Regular (400)**, dan presisi rata tengah.


