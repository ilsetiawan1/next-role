# Design System & UI/UX Specification: NextRole

> **Status:** Approved Visual Direction (v3.4.0 — Glassmorphism, Zero-Avatar Clean Typography, Poppins & iOS Glass Dock)  
> **Versi:** 3.4.0 (revisi terarah dari v3.3.0)  
> **Referensi Visual Resmi:**  
> - Kanvas, Header, Hero Carousel, Card, & Bottom Dock: `docs/assets/UI_STYLE_REFERENCES.jpg` (@siren.uix — Job Finder UI)  
> - Modal Tambah Lamaran (Otomatis & Manual) & Kuota: `docs/assets/UPLOAD_MODAL_UI_REFERENCES.png` (Iconly Upload UI)  
> **Dokumen Terkait:** `docs/PRD.md`, `docs/TSD.md`, `docs/ROADMAP.md`, `AGENTS.md`

---

## 0. Aturan Wajib untuk AI Agent (BACA DULU)

Bagian ini menang atas bagian lain bila ada konflik. Tujuannya: hasil desain terasa **lembut, lapang, bernapas (*airy*), dan dirancang manusia**, bukan kaku atau generik seperti dashboard admin.

### 0.1 Disiplin Font Weight (Anti "Semua Bold")
1. **Dilarang** memakai `font-bold`, `font-extrabold`, `font-black` (weight 700+) di mana pun, kecuali teks logo/brand mark.
2. Hanya tiga weight yang boleh dipakai: **400 (Regular)**, **500 (Medium)**, **600 (SemiBold)**.
3. **Default semua teks adalah 400.** Weight dinaikkan hanya bila tercantum di tabel 3.2.
4. Hierarki dibangun dari **ukuran, warna, dan jarak (*whitespace*)**, bukan dari bobot font.
5. Dalam satu kartu, **maksimal satu teks** ber-weight 600 (nama posisi). Sisanya 400–500.
6. Dalam satu layar, tidak boleh ada lebih dari **tiga** elemen teks ber-weight 600 di luar judul halaman.
7. Label, meta, tag, badge, placeholder, caption, dan teks nav tidak pernah di atas 500.

### 0.2 Ciri "AI-Slop" yang DILARANG Keras
* **Containeritis (Penyakit Kotak):** Membungkus Header dalam kotak persegi bergaris. Header wajib melayang bebas langsung di atas kanvas (*bare on canvas*).
* **Kata Sapaan "Hi":** Dilarang di header. Cukup foto profil, nama pengguna, dan role spesifik.
* **Komponen Reminder Strip di Home:** Dihapus dari Home page agar feed bersih dan fokus ke penemuan lowongan / prioritas tindak lanjut.
* **Menjejali Metrik Angka (Quick Stats) di Home:** Kotak metrik (18 lamaran aktif, 3 follow-up, 2 interview) dihapus dari Home karena redundan.
* **Semua teks tebal**, termasuk label kecil dan meta.
* **Tombol aksi di setiap kartu reguler:** Tombol seperti "Buka Arsip ↗" atau "Detail ↗" di pojok kartu lamaran reguler dilarang; seluruh kartu adalah area sentuh (*clickable card*).
* **Ikon Bookmark pada Hero Card:** Dilarang/dihapus sesuai arahan pengguna.
* **Teks di bawah 12px**, atau teks abu-abu terang di atas latar terang.

### 0.3 Nomenklatur Navigasi Utama
* Menu navigasi utama yang sebelumnya bernama **"Lamaran" kini resmi diganti menjadi "Roles"** (mencerminkan brand NextRole). Susunan menu: **Home · Roles · [ + ] · Kalender · Settings**.

### 0.4 Pemeriksaan Sebelum Selesai (Checklist)
- [ ] Header melayang bebas tanpa kotak pembungkus, memuat logo resmi NextRole, nama brand ("NextRole"), dan slogan ("Intelligent Job Hunt Assistant"), sisi kanan lapang/kosong.
- [ ] Tidak ada tombol notifikasi dan tidak ada chip kuota di header.
- [ ] Tidak ada komponen Reminder Strip di halaman Home.
- [ ] Tidak ada kartu metrik angka (Quick Stats) di halaman Home.
- [ ] Hero card tanpa ikon bookmark, berukuran carousel ~70% lebar layar, dengan kartu kedua terlihat mengintip.
- [ ] Kartu lamaran reguler bersih tanpa tombol aksi pojok.
- [ ] Menu "Lamaran" di bottom dock dan sidebar telah diganti menjadi "Roles".
- [ ] Modal Catat Lamaran memiliki tab split **Otomatis | Manual**, dengan kuota tampil di tab Otomatis.
- [ ] Cari `font-bold|font-extrabold|font-black` → harus nol hasil.
- [ ] Tidak ada teks < 12px.

---

## 1. Filosofi Visual: Soft Sky Glass (v3.3.0)

Terinspirasi murni dari `docs/assets/UI_STYLE_REFERENCES.jpg`:

1. **Kanvas Lembut Berkedalaman:** Latar belakang putih dengan gradasi biru es organik yang sangat pudar (`#FAFDFE` → `#F0F6FD`) dan gelombang kabut transparan.
2. **Kartu Kaca Melayang (*Soft Floating Elevation*):** Permukaan putih bersih semi-transparan (`rgba(255,255,255,0.85)` / `bg-white`), sudut membulat lebar `rounded-[28px]`, bayangan difus bernuansa biru es pudar (`box-shadow: 0 14px 34px -8px rgba(2, 132, 199, 0.12), 0 2px 6px rgba(2, 132, 199, 0.04)`).
3. **Hero Card Carousel Bernapas:** Kartu cyan-biru berpendar yang menjadi jangkar utama, bersisian dengan kartu kedua.
4. **Floating Pill Dock:** Kapsul kaca melayang memuat 5 navigasi terpadu dengan tombol tengah terangkat bercahaya.
5. **Modal Unggah Terpusat:** Pengalaman pencatatan lamaran cerdas via modal split (Otomatis & Manual) mengadopsi `docs/assets/UPLOAD_MODAL_UI_REFERENCES.png`.

---

## 2. Token Warna

### A. Brand & Surface
| Token | Nilai | Tailwind | Peruntukan |
| :--- | :--- | :--- | :--- |
| `--sky-50` | `#F4F9FF` | `bg-sky-50` | Awal kanvas, tile dalam, dropzone |
| `--sky-100` | `#E3F1FD` | `bg-sky-100` | Akhir kanvas, track progress, tombol filter search |
| `--sky-300` | `#7CC8F2` | `border-sky-300` | Garis dropzone putus-putus |
| `--sky-400` | `#2EB5F8` | `bg-sky-400` | Awal gradient hero, chip filter aktif, tombol tengah |
| `--primary` | `#0284C7` | `bg-sky-600` | Gradient hero tengah, progress fill, aksen link |
| `--primary-deep` | `#0369A1` | `bg-sky-700` | Akhir gradient hero, teks kontras tinggi |
| `--secondary-lime` | `#D4FF47` | `bg-[#D4FF47]` | Aksen sekunder terpadu: Tombol CTA Landing Page, Login Button, & Banner Slider |
| `--glass` | `rgba(255,255,255,0.82)` | `bg-white/80` | Kartu kaca melayang, floating dock |
| `--glass-solid` | `#FFFFFF` | `bg-white` | Kartu konten teks, modal unggah |

---

## 3. Tipografi

* **Font Brand / Teks Logo:** `Plus Jakarta Sans` (khusus untuk mark teks logo "NextRole" agar memiliki identitas display visual yang khas dan berwibawa).
* **Font Antarmuka (UI Text):** `Poppins` (diterapkan secara konsisten pada seluruh teks komponen: Home Mobile, Tablet, Desktop, serta modal pencatatan lamaran). Bobot font yang diizinkan: 400 (Regular), 500 (Medium), dan 600 (SemiBold).

### 3.1 Skala Ukuran
| Tingkat | Mobile | Desktop | Line Height |
| :--- | :--- | :--- | :--- |
| Judul halaman (H1) | 22px | 28px | 1.25 |
| Judul section (H2) | 15px | 18px | 1.3 |
| Judul posisi di kartu (H3) | 15px | 16px | 1.35 |
| Body / deskripsi | 14px | 14px | 1.55 |
| Meta / gaji / info | 13px | 13px | 1.4 |
| Micro (badge, tag, label nav) | 12px | 12px | 1.2 |

### 3.2 Weight per Elemen (Sumber Kebenaran Tunggal)
| Elemen | Weight | Warna |
| :--- | :--- | :--- |
| Teks Logo "NextRole" | 600 (Plus Jakarta Sans) | slate-900 |
| Slogan / Tagline | 400–500 (Poppins) | slate-500 |
| Nama pengguna di Header | 600 (Poppins) | slate-900 |
| Role pengguna di Header | 400 (Poppins) | slate-500 |
| Judul section ("Perlu Tindak Lanjut", "Aktivitas Terakhir") | 600 (Poppins) | slate-900 |
| Nama posisi kerja (Hero & Card) | 600 (Poppins) | slate-900 (putih di Hero) |
| Nama perusahaan | 500 (Poppins) | slate-700 (putih di Hero) |
| Lokasi & sub-info | 400 (Poppins) | slate-500 |
| Rentang gaji | 500 (Poppins) | slate-700 (putih/90 di Hero) |
| Tag metadata (Full-time, Hybrid) | 400–500 (Poppins) | slate-600 |
| Status badge | 500 (Poppins) | blue-700 / amber-700 / purple-700 |
| Tombol CTA Hero ("Draf Pesan HRD ↗") | 600 (Poppins) | text-white (bg-sky-600 #0284C7) |
| Link ("Lihat semua ›") | 500 (Poppins) | sky-700 |
| Label nav aktif | 500 (Poppins) | sky-800 |
| Label nav nonaktif | 400 (Poppins) | slate-500 |

---

## 4. Komponen Antarmuka Terpadu

### A. Header Pengguna (Mobile — Naked on Canvas)
* **Tanpa wadah kotak:** Elemen melayang langsung di atas kanvas sky, mengadopsi referensi minimalis *Oakory UI*.
* Kiri:
  - **Logo Resmi NextRole:** Badge squircle `38x38` memuat logo surge arrow biru-cyan (`docs/assets/next-role-logo.jpg`).
  - **Nama Brand:** **"NextRole"** (18px, 600, slate-900).
  - **Slogan / Tagline:** **"Intelligent Job Hunt Assistant"** (11px, 500, slate-500).
* Kanan:
  - **KOSONG / LAPANG:** Tanpa tombol notifikasi, tanpa chip kuota, tanpa ikon keranjang. Memberikan ruang bernapas yang bersih dan lega.

### B. Search Bar & Filter Chips Carousel
* **Search Bar:** Kapsul lonjong putih penuh `h-12 rounded-full bg-white shadow-sm border border-slate-100/60 px-4`.
  - Kiri: Ikon search tipis + placeholder "Cari perusahaan atau posisi…" (13px, 400, slate-400).
  - Kanan: Tombol filter squircle cyan lembut (`w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center`).
* **Filter Chips Carousel:** Deretan kapsul scroll horizontal tepat di bawah search bar:
  - Chip aktif (`Semua`): Kapsul cyan gradien cerah `bg-gradient-to-r from-sky-400 to-sky-600 text-white font-medium px-4 py-1.5 rounded-full shadow-sm`.
  - Chip nonaktif (`Full Time`, `Hybrid`, `Remote`): Kapsul putih bersih `bg-white text-slate-700 border border-white shadow-xs px-3.5 py-1.5 rounded-full`.
  - Chip terakhir memotong tepi kanan (*peek edge*) sebagai petunjuk scroll tanpa scrollbar.

### C. Recommended Carousel (Hero Card Perlu Tindak Lanjut — Amber Accent Glass Surface)
* Format: **Carousel Horizontal dengan Lebar Kartu ~70–75% Layar (`w-[260px]`)**.
* Di sisi kanannya: Kartu kedua (*Apple UI/UX*) tampak mengintip jelas selebar ~70–80px (*carousel peek*, `x: 292`, `clip: true`).
* Visual Hero Card:
  - Latar: Kaca putih semi-transparan (`rgba(255, 255, 255, 0.85)` / `bg-white/85`) dengan pendaran bayangan difus biru lembut (`box-shadow: 0 10px 24px -4px rgba(2, 132, 199, 0.10), 0 2px 6px rgba(15, 23, 42, 0.04)`). Mencegah kompetisi visual dengan Hero Banner Slider biru di atasnya.
  - Border/Aksen: Garis tepi amber halus `border border-amber-200` (`#FDE68A`, `strokeWeight: 1.5`) yang memberi sinyal urgensi tindak lanjut tanpa mencolok atau bentrok.
  - Sudut: `rounded-[24px]`.
  - **Zero-Avatar Clean Layout:** Dihilangkan seluruh avatar/logo bulat agar kartu berfokus penuh pada hierarki teks yang bersih dan elegan.
  - Baris 1: Nama perusahaan "Tokopedia" (14px, Bold 600, `text-slate-900`) & lokasi "Jakarta Selatan • Hybrid" (12px, Regular 400, `text-slate-500`) dimulai rata kiri `x: 16`.
  - Baris 2: Nama posisi kerja "Senior Frontend Engineer" (16px, Bold 600, `text-slate-900`).
  - Baris 3: Rentang gaji "Rp 18.000.000 - 25.000.000" (13px, Regular 400, `text-slate-500`).
  - Baris 4: Kapsul status soft amber pill `H+7 Hari Ini` (`bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full`) di kiri, bersisian dengan tombol aksi ringkas **Sky Blue `#0284C7`** `Draf Pesan ↗` (`bg-[#0284C7] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-sky-700 transition-all shadow-sm`) di kanan. Warna tombol selaras dengan tema utama dan tidak menciptakan kontras hitam yang terlalu tajam.

### D. Latest Post (Kartu Lamaran Reguler — Glassmorphic Clean Surface)
* Format: Kartu kaca melayang modern `rounded-[28px] p-4 bg-white/85 border border-white shadow-[0_8px_20px_-4px_rgba(2,132,199,0.08)]`.
* **Zero-Avatar Clean Typography:** Tanpa avatar atau lingkaran inisial logo perusahaan.
* **Tanpa tombol aksi di pojok kartu:** Seluruh kartu adalah target sentuh untuk membuka lembar detail.
* Komposisi:
  1. Baris 1: Nama perusahaan & lokasi ("Grab Indonesia • Jakarta Selatan") di kiri + Badge status soft pill di kanan (`Interview Besok` / `Applied`).
  2. Baris 2: Nama posisi kerja (H3, 15px, 600, slate-900) + Rentang gaji (13px, 400, slate-500).
  3. Baris 3: Deretan tag metadata / info jadwal: `Zoom • 14:00 - 15:00 WIB` atau `Terkirim 2 hari lalu` (`text-xs bg-slate-50 text-slate-500 rounded-full px-3 py-1`).

### E. Modal Kontekstual Mobile (Smart Clipper & Catat Lamaran — 390x844 Frame)
Modal tidak berdiri sendiri di kanvas kosong, melainkan diwujudkan dalam frame mobile (`390x844`) lengkap dengan konteks halaman Home di latar belakang yang diblur dan digelapkan secara elegan (`backdrop-blur-md bg-slate-900/50`):

1. **`Modal Smart Clipper - (Mobile 390x844)`:**
   - **Backdrop Blur Overlay:** Lapisan penutup layar penuh `w: 390, h: 844` dengan transparansi gelap dan blur halus (`#0F172A` opacity 0.5 + blur 16px).
   - **Kartu Modal Mengambang:** Kartu putih terpusat vertikal `w: 350, h: 580, rounded-3xl`, bayangan difus elevasi tinggi (`0 16px 32px rgba(15,23,42,0.15)`).
   - **Header Modal:** Judul "Catat Lamaran Baru" (18px Regular Poppins), subtitle "Ekstrak otomatis info loker dari tangkapan layar", dan tombol tutup `✕` bulat di pojok kanan atas.
   - **Segmented Control (w: 310, h: 36):** Tab `Otomatis (AI)` (Aktif, kartu putih shadow halus) | `Manual`.
   - **Dropzone Area (w: 310, h: 154):** Garis putus-putus biru langit (`1.5px dashed #BAE6FD`), orb ikon panah unggah, teks instruksi, dan bilah input URL cepat ("Atau tempel link loker...") dengan tombol "Tempel".
   - **File Preview Card (w: 310, h: 66):** Menampilkan file terpilih "Screenshot_Tokopedia_Frontend.png" (PNG • 1.8 MB • Siap diekstrak) dengan progress bar biru penuh.
   - **Panel Kuota Kontekstual:** "Sisa Kuota: 18 / 20 klip hari ini • Gemini 1.5 Flash" berlatar hijau lembut `#F0FDF4`.
   - **Footer Aksi:** Tombol "Batal" (w: 100) dan tombol utama "Ekstrak dengan AI ↗" (w: 200, gradien sky blue dengan bayangan lembut).

2. **`Modal Catat Lamaran - (Mobile 390x844)`:**
   - **Struktur Layar:** Frame mobile `390x844` berlatar belakang halaman Home yang diblur, dengan kartu modal putih di tengah (`w: 350, h: 580, rounded-3xl`).
   - **Header Modal:** Judul "Catat Lamaran Baru" (18px Regular Poppins), subtitle "Simpan lowongan kerja ke pipeline karir Anda", dan tombol tutup `✕`.
   - **Segmented Control:** Tab `Otomatis (AI)` | `Manual` (Aktif).
   - **Field Formulir Manual:**
     1. `Nama Perusahaan`: Placeholder "Contoh: Tokopedia, Shopee, GoTo".
     2. `Posisi / Role Lowongan`: Placeholder "Contoh: Senior Frontend Engineer".
     3. `Tipe Kerja` (3 Pills): `Remote` | `Hybrid` (Aktif) | `On-Site`.
     4. `Perkiraan Rentang Gaji (Opsional)`: Placeholder "Contoh: Rp 18.000.000 - 25.000.000".
     5. `Deskripsi Pekerjaan & Kualifikasi (Wajib)`: Textarea multi-baris "Tempel deskripsi: React, Next.js, TypeScript, REST API...".
     6. **Strip Bantuan:** "✓ Lamaran otomatis dicatat ke kolom Applied di Kanban" (`#F0FDF4`).
     7. **Footer Aksi:** Tombol "Batal" (w: 100) dan "Simpan Lamaran" (w: 200, `#0284C7`).

### F. Banner Slider / Hero Announcement Carousel (E-Commerce & SaaS Promo Style)
Mengadopsi pola visual banner slider modern (Gambar Referensi ke-4) untuk menggantikan dropzone repetitif di halaman utama:
* **Visual Floating Glass Card & Kontur Estetik:** Gradien biru langit (`linear-gradient(135deg, #0284C7 0%, #0369A1 100%)`), sudut membulat `rounded-3xl` (22px-24px), specular border kaca translusen halus (`border border-white/25` / `#FFFFFF40`), aksen gelombang fluid translusen di latar, serta elevasi mengambang (*floating glass effect*) dengan dual drop shadow (ambient cyan glow `y: 12-16, r: 28-36` + diffuse shadow `y: 4, r: 10`).
* **Presisi Jarak Subkomponen (Balanced Vertical Gaps):**
  - Jarak vertikal antara Judul Banner dan Subtitle dirancang seimbang dan identik dengan jarak antara Subtitle dan Tombol CTA (Mobile: gap ~9-10px; Tablet: gap ~12px; Desktop: gap ~14px).
  - Mencegah tombol CTA menempel (*touching*) pada baris teks terbawah deskripsi.
* **Kontur Notch Berlekuk (*Scooped Bottom Tab*):** Mengadopsi lekukan tab unik pada tepi bawah tengah banner (`rounded-t-xl bg-[#F4F9FF]`) yang menyatu dengan kanvas, menjadi wadah estetik bagi indikator pagination dots `● ○ ○` (warna primary `#0284C7`).
* **Artwork 3D Karier & Glassmorphism Terisolasi (100% Alpha Transparent):**
  - **Asset Tersimpan di Repository:**
    * `docs/assets/banner-object-1.png`: Dokumen resume matte white clay dengan segel centang cyan neon, clipboard kaca frosted translusen dengan garis grafik pertumbuhan cyan dan mini bars data 3D.
    * `docs/assets/banner-object-2.png`: Pedestal disk kaca melingkar translusen dengan panah pertumbuhan 3D neon cyan menjulang tinggi.
  - **Integrasi Visual:** Menggunakan format PNG transparan murni (*pure alpha channel*), sehingga objek 3D melayang bebas langsung di atas gradien biru langit (`#0284C7` $\rightarrow$ `#0369A1`) dan aksen pita gelombang tanpa garis batas atau kotak latar apa pun.
  - Di **Desktop & Tablet**: Berada di sisi kanan dengan proporsi lega (`w: 160-182, h: 130-146`).
  - Di **Mobile**: Diposisikan di sisi kanan (`x: 210, w: 135, h: 112`) berpadu dengan teks 2 baris yang tidak saling bertumpuk.
* **Konten Teks & Aksi:**
  - Headline cerah: "Kuasai Wawancara Kerja dengan Ringkasan AI" / "Kuasai Wawancara AI" di mobile (putih, SemiBold).
  - Subline: "Dapatkan draf follow-up otomatis dan arsip permanen lowongan" (putih/88, Regular).
  - **Tombol CTA Aksen Lime Kontras (Brand Secondary #D4FF47):** Kapsul pill membulat penuh `rounded-full bg-[#D4FF47] text-slate-900 font-semibold px-4 py-2 shadow-md` dengan teks **"Coba Sekarang ↗"**, selaras 100% dengan tombol aksi utama pada Landing Page dan Login Page untuk mengarahkan pengguna ke Modal Catat Lamaran (Smart Job Clipper).
* **Penyelarasan Tablet:** Search bar (`w: 284`) dan tombol filter (`w: 44`) di topbar tablet diposisikan rata kanan persis (*flush*) dengan sisi kanan Banner Slider dan konten di bawahnya (`x: 818`).

### G. Floating Pill Nav Dock (Mobile — iOS Premium Glass Dock)
Mengadopsi nuansa premium iOS frosted glass melayang:
* **Bentuk:** Kapsul membulat penuh (*pill dock* `rounded-full`), melayang di posisi `bottom-4`, lebar `calc(100% - 32px)`, tinggi `68px`.
* **Material iOS Frosted Glass:** `bg-white/80 backdrop-blur-xl border border-white shadow-[0_16px_36px_-6px_rgba(2,132,199,0.14),0_4px_12px_rgba(15,23,42,0.06)]`.
* **Susunan 5 Tab Lengkap Berlabel (Clean Thin Outline Icons + 12px Labels):**
  1. `Home`: Kapsul aktif biru muda lembut (`bg-sky-100/85 border border-sky-200/80 rounded-2xl`) + ikon rumah clean thin outline (`stroke: 1.75px, #0284C7`) + teks label "Home" (12px, 600, sky-600).
  2. **`Roles` (Resmi menggantikan Lamaran):** Ikon tas kerja / briefcase clean thin outline (`stroke: 1.5px, #64748B`, `fill: none`) + teks label "Roles" (12px, 500, slate-500).
  3. **Tombol Tengah Terangkat (Raised Center Button):**
     - Lingkaran `56x56 px` naik melayang terangkat `-translate-y-3.5` dengan **tepi putih tebal (*thick white rim* 4px)** `border-4 border-white`.
     - Latar: Gradien cyan-sky cerah (`linear-gradient(135deg, #2EB5F8 0%, #0284C7 100%)`).
     - Cincin pendaran cahaya (*glowing ring*): `box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.35)`.
     - Ikon: Simbol `+` putih bersih tebal 2.5px.
     - Fungsi: Membuka Modal Catat Lamaran (Seksi 4.E).
  4. `Kalender`: Ikon kalender clean thin outline (`stroke: 1.5px, #64748B`, `fill: none`) + teks label "Kalender" (12px, 500, slate-500).
  5. `Settings`: Ikon pengaturan gear clean thin outline (`stroke: 1.5px, #64748B`, `fill: none`) + teks label "Settings" (12px, 500, slate-500).

### H. Detail Lamaran Berbasis Bottom Sheet (Mobile 390x844 — Sinkronisasi Penuh Input Lamaran)
Mengadopsi hierarki visual lembar detail premium dan lapang dari referensi visual pengguna (`media_1794411634362_a5ed72dc.png`) dengan seluruh data tersinkronisasi 100% terhadap field inputan formulir pencatatan lamaran:
* **Backdrop & Top Navigation Bar (`y: 44–90`):**
  - Tombol Back bulat (`40x40 rounded-full bg-white shadow-sm`) dengan simbol chevron tipis `‹`.
  - Header Perusahaan tengah: Nama perusahaan ("Tokopedia", 15px, Regular, `#0F172A`) dengan centang biru verified badge `✓`.
  - Tombol Bookmark bulat (`40x40 rounded-full bg-white shadow-sm`) dengan aksen ribbon merah minimalis (`#F43F5E`).
* **Elevated White Bottom Sheet (`y: 190`, `h: 654`, `rounded-t-[36px]`):**
  - **Raised Logo Avatar:** Badge logo perusahaan bulat 64x64 menimpa tepi atas lembar detail (`-mt-8` / `y: -32`) dengan border halus `#F1F5F9` dan bayangan lembut.
  - **Judul Posisi & Rentang Gaji:** Nama posisi ("Senior Frontend Engineer", 18px, Regular, `#0F172A`) dan gaji ("Rp 18.000.000 - 25.000.000 / bln", 13px, Regular, `#64748B`) tersusun simetris di tengah (persis field formulir).
  - **Metadata Chips Row (Sinkron Inputan):** Tiga kapsul minimalis bersih yang merefleksikan data input:
    1. `Hybrid` (Tipe Kerja)
    2. `Jakarta Selatan` (Lokasi Kerja)
    3. `Applied` (Status Pipeline)
  - **Segmented Control Tabs (`h-11 rounded-2xl bg-slate-100`):** Dua tab esensial yang ringkas dan fokus:
    1. `Deskripsi` (Aktif, kartu putih timbul dengan shadow-xs halus).
    2. `Perusahaan` (Teks slate netral).
  - **3-Kolom Info Strip Card (`bg-[#F8FAFC]` — 100% Selaras Input Form):**
    - Kolom 1: "Hybrid" (13px Regular) / "Tipe Kerja" (11px Regular, `#94A3B8`).
    - Kolom 2: "Jakarta Selatan" (12px Regular) / "Lokasi Kerja" (11px Regular, `#94A3B8`).
    - Kolom 3: "Applied" (13px Regular) / "Status Kanban" (11px Regular, `#94A3B8`).
  - **Deskripsi & Kualifikasi:** Judul "Deskripsi & Kualifikasi" (15px Regular, persis label input form) + tombol more `•••`. Paragraf deskripsi ringkas ("Bertanggung jawab atas arsitektur frontend web app dengan Next.js & TypeScript, mengoptimalkan Core Web Vitals, serta kolaborasi lintas tim.") dengan link `"Baca Selengkapnya ›"` (`#0284C7`) berjarak vertikal 14px bebas tabrakan.
  - **2-Kolom Metadata Cards (Status & Riwayat Input):**
    - Kartu 1: Label "Tanggal Melamar" / Nilai "7 Hari Lalu" (tercatat di sistem).
    - Kartu 2: Label "Tindak Lanjut" / Nilai "H+7 Hari Ini" (urgensi follow-up recruiter).
  - **Slide-to-Action Bottom CTA Bar (`h-14 rounded-full bg-gradient-to-r from-sky-600 to-sky-700`):** Slider interaktif modern dengan tombol kapsul putih *"Draf Pesan HRD ↗"* (tindak lanjut logis untuk lamaran yang telah tercatat) dan deretan chevron `› › › › ›` transparan.
  - **Home Indicator:** Garis navigasi iOS (`128x4 rounded-full bg-slate-300`) di bagian bawah dengan safe padding 24px.

---


## 5. Layout Responsif

### A. Mobile (< 768px / 390px — Scrollable Feed Flow)
* Padding `px-4 pt-3 pb-28`.
* **Alur Hirarki Home Mobile Resmi (Scrollable Feed):**
  1. **Header Naked:** Avatar + "Budi Santoso" + "Fullstack Web Developer" (tanpa kotak, tanpa "Hi", tanpa notifikasi, tanpa kuota).
  2. **Search Bar & Filter Button.**
  3. **Filter Chips Carousel:** `Semua` | `Full-time` | `Hybrid` | `Follow-Up` | `Remote`.
  4. **Banner Slider Hero:** Banner edukasi/fitur AI cerdas bergradien biru dengan aksen tombol kuning dan pagination dots `● ○ ○`.
  5. **Perlu Tindak Lanjut (Hero Carousel):** Kartu Tokopedia (H+7) tanpa bookmark + kartu Apple mengintip.
  6. **Aktivitas Terakhir (Latest Post Feed):** Kartu lamaran putih Grab & Shopee tanpa tombol pojok.
  7. **Floating Pill Dock:** 5 tab lengkap dengan raised center FAB (Home · Roles · [ + ] · Kalender · Settings).

### B. Tablet (768px – 1023px / 834px) — 2-Column Balanced Bento Layout
* Slim glass sidebar `w-20` melayang memanjang: Brand logo, tombol `+` catat lamaran di atas, ikon navigasi vertikal (Home, Roles, Kalender, Settings), dan avatar profil di bagian bawah (`y: 1080`).
* Top bar: "Budi Santoso" · "Fullstack Web Developer", search bar pill ("Cari perusahaan atau posisi..."), filter button.
* **Banner Slider Tablet:** Membentang lebar di atas konten (`w: 714, h: 140`) di `y: 96`.
* **2-Kolom Balanced Bento Grid (y: 256 s.d. y: 1180):**
  - **Kolom Kiri (w: 420): Application Feed & Follow-Ups**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. Hero Card Tokopedia (H+7) (`h: 168`)
    3. Card Bukalapak (Follow-Up H+7) (`h: 154`)
    4. Card GoTo Financial (Follow-Up H+6) (`h: 154`)
    5. Header "Pipeline Lamaran" + link "Lihat semua ›"
    6. Card Grab Indonesia (Interview Besok, Zoom) (`h: 154`)
    7. Card Shopee Indonesia (Applied) (`h: 154`)
  - **Kolom Kanan (w: 278): Analytics, Mini Calendar, & Career Insights**
    1. Header "Statistik Lamaran" + link "Bulan Ini ›"
    2. Quick Analytics Bento Card (`h: 220`): 4 metrik pastel (Total Dilamar: 24, Interview: 3, Perlu Follow-Up: 2, Tingkat Respon: 68%)
    3. Header "Kalender Agenda" + link "Buka ›"
    4. Mini Calendar Card (`h: 360`): Kalender interaktif November 2026 dengan indikator tanggal aktif (12 Hari Ini, 13 Grab Interview, 14 Tokopedia H+7) dan kartu agenda Zoom interview Grab
    5. Header "Tips & Insight AI"
    6. Career Tips Card (`h: 216`): Insight follow-up H+7 dengan CTA "Gunakan Draf AI ›"

### C. Desktop (≥ 1024px / 1440px) — 3-Column Modular Bento Dashboard
* Floating glass sidebar `w-64`: Brand NextRole (courier new lowercase), tombol pill gradien `+ Catat Lamaran Baru`, menu vertikal dengan active state rata tengah (Home, Roles, Kalender, Settings), **Widget Kuota Resmi (18/20)**, dan profil footer Budi Santoso.
* Top bar: "Budi Santoso" · "Fullstack Web Developer", search bar pill ("Cari perusahaan atau posisi..."), filter button.
* **3-Kolom Modular Bento Dashboard (y: 96 s.d. y: 674, tinggi kolom identik terpadu):**
  - **Kolom 1 (x: 304, w: 354) — Perlu Tindak Lanjut:**
    1. Header "Perlu Tindak Lanjut" + link "Lihat semua ›"
    2. Hero Card Tokopedia (H+7) (`h: 184`)
    3. Card Bukalapak (Follow-Up H+7) (`h: 164`)
    4. Card GoTo Financial (Follow-Up H+6) (`h: 164`)
  - **Kolom 2 (x: 678, w: 354) — Pipeline Lamaran Aktif:**
    1. Header "Pipeline Lamaran" + link "Lihat semua ›"
    2. Banner AI Carousel Kuasai Wawancara AI (`h: 184`)
    3. Card Grab Indonesia (Interview Besok, Zoom 14:00 - 15:00 WIB) (`h: 164`)
    4. Card Shopee Indonesia (Applied, Terkirim 2 hari lalu) (`h: 164`)
  - **Kolom 3 (x: 1052, w: 368) — Statistik & Kalender Agenda:**
    1. Header "Statistik & Kalender"
    2. Quick Analytics Bento Card (`h: 184`): 4 metrik pastel (Total Dilamar: 24, Interview Aktif: 3, Perlu Follow-Up: 2, Tingkat Respon: 68%)
    3. Mini Calendar Card (`h: 344`): Kalender interaktif bulan berjalan dengan highlight status lamaran dan kartu agenda interview Grab Besok.

---

## 6. Standardisasi Frame Mobile & Bottom Sheet Detail Lamaran (v3.1.0)

### A. Format Frame Mockup Mobile (`390x844`, `cornerRadius: 36`, `clip: true`)
* Seluruh frame mobile (`Home`, `Modal Smart Clipper`, `Modal Catat Lamaran`, `Detail Lamaran`) diseragamkan menggunakan format **iOS Device Viewport Frame**:
  - Dimensi: `390 x 844 px`
  - Radius sudut: `36px`
  - Floating Bottom Nav Dock (`350 x 68 px`) terjangkar elegan di `y: 756` dengan Raised FAB di `y: 734`.

### B. Detail Lamaran — Contextual Glass Bottom Sheet
* **Latar Belakang:** Menampilkan layar `Home` penuh dengan lapisan `Backdrop Overlay` (`#0F172A` opacity 0.5 + `layerBlur: 16px`).
* **Top Bar Interaktif:**
  - Tombol kembali lingkaran putih (`40 x 40 px`, radius 20px) dengan ikon chevron `‹` (`#0F172A`, centered).
  - Tanda merah/trash dan judul teks atas Tokopedia dihilangkan agar fokus visual tertuju langsung ke konten sheet.
* **Arsitektur Konten Bottom Sheet (`y: 274`, `h: 570 px`, `cornerRadius: [36, 36, 0, 0]`):**
  1. **Raised Company Logo (`64 x 64 px`):** Circle logo TKP menimpa tepi atas sheet (`y: -32`).
  2. **Hirarki Identitas Pekerjaan:**
     - Nama Perusahaan: `Tokopedia` (Sky-600 `#0284C7`, text-sm 14px, font normal, text-center).
     - Nama Jabatan: `Senior Frontend Engineer` (Slate-900 `#0F172A`, text-lg 18px, font normal, text-center).
     - Rentang Gaji: `Rp 18.000.000 – 25.000.000 / bln` (Slate-500 `#64748B`, text-xs 13px, text-center).
     - *(Badge redundan tipe kerja, lokasi, dan status di bawah gaji dihapus bersih).*
  3. **Segmented Control Tabs:** `Deskripsi` (tab aktif) | `Perusahaan`.
  4. **3-Column Info Strip:** `Hybrid` (Tipe Kerja) | `Jakarta Selatan` (Lokasi Kerja) | `Applied` (Status Kanban).
  5. **Deskripsi & Kualifikasi:** Paragraf rapi + link `Baca Selengkapnya ›`.
  6. **Timeline Cards (2-Kolom):** `Tanggal Melamar` (7 Hari Lalu) | `Tindak Lanjut` (H+7 Hari Ini).
  7. **Centered Action Button:** Pill button Sky Blue (`350 x 50 px`, radius 25px, `#0284C7`) dengan teks rata tengah `"Draf Pesan HRD ↗"` (putih, 15px), menggantikan slider action.
  8. **iOS Home Indicator:** Strip abu-abu halus (`128 x 4 px`, `#CBD5E1`) di bagian bawah sheet.

