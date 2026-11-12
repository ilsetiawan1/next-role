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
