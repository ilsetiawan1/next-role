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

### E. Modal Catat Lamaran (Split: Otomatis & Manual)
Dibuka saat menekan tombol tengah dock `+` di mobile/tablet atau tombol `+ Catat Lamaran Baru` di sidebar desktop:

1. **Wadah Modal:** Kaca putih solid `rounded-[28px] p-6 shadow-2xl`, latar belakang diblur lembut (`backdrop-blur-md bg-slate-900/25`).
2. **Segmented Tab (Atas):**
   - Kapsul tab: `w-full h-11 bg-slate-100 rounded-xl p-1 flex`.
   - **Tab Otomatis (Aktif):** Kapsul putih melayang dengan shadow halus, teks "Otomatis (AI)" (13px, 600, sky-700).
   - **Tab Manual:** Teks "Manual" (13px, 500, slate-600).
3. **Konten Tab Otomatis (`UPLOAD_MODAL_UI_REFERENCES.png`):**
   - Dropzone area dashed: Border `1.5px dashed sky-300 rounded-[22px] bg-slate-50/70 p-6`.
   - **Orb Unggah 3D Frosted Glass (Iconly Aesthetic):**
     * Lingkaran kaca `60x60 px` dengan specular shine melengkung di tepi atas.
     * Gradien kaca translusen (`linear-gradient(135deg, rgba(255,255,255,0.95), rgba(224,242,254,0.75), rgba(186,230,253,0.6))`).
     * Border glossy putih transparan `1.5px solid rgba(255, 255, 255, 0.95)` dan pendaran bayangan difus biru langit (`box-shadow: 0 8px 20px rgba(2, 132, 199, 0.32)`).
     * Ikon panah unggah biru tajam `#0284C7` di tengah.
   - Sub-teks instruksi & input link loker ("Tempel Link").
   - File preview item: Thumbnail dokumen, nama file, progress bar, tombol remove `×`.
   - **Panel Kuota Kontekstual:** "Sisa Kuota: 18 / 20 klip hari ini • Memakai 1 klip" (13px, 500, sky-800) dengan badge AI Flash 1.5.
   - Footer: Dua tombol pill sejajar ("Batal" & "Ekstrak dengan AI ↗").
4. **Konten Tab Manual (Dokumentasi Permanen Anti-Lupa):**
   - Field input form bersih:
     * Nama Perusahaan (Placeholder: "Contoh: GoTo, Shopee, Traveloka").
     * Posisi / Role Lowongan (Placeholder: "Contoh: Senior Frontend Engineer").
     * Tipe Kerja Pills: `Remote` (aktif) | `Hybrid` | `On-Site`.
     * Perkiraan Rentang Gaji (Opsional).
     * **Deskripsi Pekerjaan & Kualifikasi (Wajib):** Textarea multi-baris `h-20` (Placeholder: *"Tempel deskripsi atau kualifikasi: React, Next.js, TypeScript, REST API, min. 2 th pengalaman..."*). Bersifat wajib agar pengguna memiliki arsip permanen dan tidak kebingungan saat dipanggil wawancara.
   - Strip konfirmasi: "✓ Lamaran akan otomatis dicatat ke kolom Applied di Kanban".
   - Footer: Tombol "Batal" & "Simpan Lamaran".

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

### B. Tablet (768px – 1023px / 834px)
* Slim glass sidebar `w-20` melayang memanjang: Brand logo, tombol `+` catat lamaran di atas, ikon navigasi vertikal (Home, Roles, Kalender, Settings), dan avatar profil di bagian bawah (`y: 1080`).
* Top bar: "Budi Santoso" · "Fullstack Web Developer", search bar pill, filter button.
* **Banner Slider Tablet:** Membentang lebar di atas konten (`w: 714, h: 140`) menggantikan dropzone redundan.
* **2-Kolom Bento di bawah Banner:**
  - Kiri: Perlu Tindak Lanjut (Hero Tokopedia H+7 + Card Bukalapak H+7).
  - Kanan: Pipeline Terkini Feed Card.

### C. Desktop (≥ 1024px / 1440px)
* Floating glass sidebar `w-64`: Brand NextRole, tombol pill gradien `+ Catat Lamaran Baru`, menu vertikal (Home, Roles, Kalender, Settings), **Widget Kuota Resmi (18/20)**, dan profil footer Budi Santoso.
* Main area:
  - Baris 1: **Banner Slider Desktop (`w: 1116, h: 154`)** menggantikan dropzone repetitif.
  - Baris 2: 2-Kolom Bento:
    * Kiri (w: 680): Perlu Tindak Lanjut (Hero Tokopedia H+7 + Bukalapak H+7).
    * Kanan (w: 416): Pipeline Terkini Activity Card.
