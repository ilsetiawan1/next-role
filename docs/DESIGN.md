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

## 5. Spesifikasi Tata Letak Halaman Roles / Kanban Board (Desktop, Tablet, Mobile)

Mengadopsi hierarki visual dan bahasa desain **Soft Sky Glass Elevation** yang selaras 100% dengan halaman Home:

### A. Standardisasi Label Menu: `Roles`
* Seluruh menu navigasi lintas halaman (Desktop navbar, Tablet navbar, dan Mobile dock) telah distandardisasi menjadi **`Roles`** (menggantikan label *Lamaran* sebelumnya).
* Status aktif pada halaman Roles menampilkan:
  * Desktop: Sky pill container aktif pada tab `Roles` (`#0284C7` dengan teks putih).
  * Tablet: Sky pill tab aktif pada `Roles` (`#0284C7` dengan teks putih).
  * Mobile: Tab dock aktif pada ikon & label `Roles` (`#E0F2FE` soft pill dengan teks `#0284C7`).

### B. Desktop (1440x900) — 5-Kolom Horizontal Kanban Board
* **Top Floating Pill Navbar (`w: 1344, h: 64`, y: 20):** Tab `Roles` aktif.
* **Header Bar (y: 102):**
  * Judul "Papan Lamaran" (`fontSize: 24, fontStyle: SemiBold, #0F172A`)
  * Subtitle "Kelola 18 lamaran aktif di 5 tahap pipeline" (`fontSize: 13, #64748B`)
  * Search bar pill (`w: 310, h: 44`, x: 976) + filter square button (`w: 44, h: 44`, x: 1298)
* **5 Kolom Pipeline Seimbang (y: 176 s.d. 736, h: 560):**
  * `Applied` (w: 256, x: 48)
  * `Follow-Up Needed` (w: 256, x: 320)
  * `Interview Scheduled` (w: 256, x: 592)
  * `Offered` (w: 256, x: 864)
  * `Rejected / Ghosted` (w: 256, x: 1136)
  * Material kaca semi-transparan (`bg-white/55 backdrop-blur-xl border border-white/90 rounded-3xl`).
* **Ringkasan Pipeline Strip (y: 760, w: 1344, h: 96):**
  * 4 kotak metrik dengan ikon 3D glassmorphic (Total Dilamar: 24, Interview Aktif: 3, Perlu Follow-Up: 2, Tingkat Respon: 68%).

### C. Tablet (834x1194) — 2-Row Balanced Bento Kanban
* **Top Navbar Tablet (`w: 786, h: 58`, y: 20):** Tab `Roles` aktif.
* **Header Bar (y: 98):** Judul "Papan Lamaran" + Search Bar pill + Filter button.
* **Ringkasan Pipeline Strip Tablet (y: 160, w: 786, h: 84):** 4 kotak metrik simetris dengan ikon 3D glassmorphic seragam.
* **Row 1 (y: 258 s.d. 698, h: 440):** 3 kolom berdampingan (`Applied`, `Follow-Up Needed`, `Interview Scheduled`), masing-masing `w: 248px`.
* **Row 2 (y: 714 s.d. 1154, h: 440):** 2 kolom berdampingan (`Offered` & `Rejected / Ghosted`), masing-masing `w: 382px` (ritme 2-kolom identik dengan Tablet Home).

### D. Mobile (390x844) — Single Column Feed dengan Status Chips
* **Top Header:** Logo resmi NextRole + brand text + search bar dengan tombol filter.
* **Filter Chips Carousel (y: 138, h: 32):** Chips filter status pipeline horizontal (`Semua (18)`, `Applied (6)`, `Follow-Up (3)`, `Interview (3)`, `Offering (1)`).
* **Card Feed (y: 182 s.d. 730):** 4 kartu lamaran vertikal bernuansa kaca bersih dengan status badge pastel dan tombol aksi ringkas berjarak aman.
* **Floating Bottom Pill Nav Dock (`h: 68`, y: 756):** Menu `Roles` aktif dengan soft blue pill highlight + Raised FAB Catat Lamaran (+) di tengah. Seluruh label navigasi (*Home*, *Roles*, *Kalender*, *Settings*) menggunakan ukuran **10px (`text-[10px]` / `2xs`)**, bobot **Regular (400)**, dan penempatan presisi rata tengah (`width: 62, x: 0, textAlign: center, y: 30`) untuk estetika minimalis, airy, dan proporsional.

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


