# Product Requirements Document (PRD) — NextRole

> **Status:** Approved / Ready for Architecture  
> **Versi:** 1.1.0  
> **Target Rilis:** Q4 2026  
> **Owner:** Fullstack Product Engineering

---

## 1. Ringkasan Eksekutif & Visi Produk

**NextRole** adalah platform asisten karir cerdas berbasis web (*Intelligent Job Hunt Assistant*) yang dirancang khusus untuk mengotomatisasi proses pelacakan lamaran kerja, menjaga etika komunikasi dengan perekrut, dan mempersiapkan kandidat menghadapi tahapan wawancara tanpa stres.

### Visi Produk
Mengubah proses pencarian kerja yang sebelumnya kacau, serba manual (spreadsheet/Notion), dan rentan lupa menjadi alur kerja yang teratur, proaktif, dan terotomatisasi secara cerdas dalam satu ruang kerja tunggal (*Single Unified Workspace*).

---

## 2. Masalah Pengguna (Problem Statements)

1. **Kehilangan Akses Deskripsi Pekerjaan (*Ghosted Job Postings*):**  
   Iklan lowongan kerja di LinkedIn/Glints sering ditutup atau dihapus beberapa hari setelah dibuka. Saat kandidat dipanggil wawancara 2–3 minggu kemudian, mereka tidak bisa membaca ulang kualifikasi dan tanggung jawab pekerjaan tersebut.
2. **Kelelahan Input Manual (*Friction Fatigue*):**  
   Mencatat lamaran ke spreadsheet memerlukan input manual 5–10 kolom untuk setiap perusahaan, membuat pelamar malas mencatat setelah hari ke-3.
3. **Lupa Jadwal & Canggung Melakukan Tindak Lanjut (*Follow-Up*):**  
   90% pencari kerja tidak tahu kapan waktu yang sopan untuk melakukan *follow-up* ke HRD dan bingung bagaimana menyusun draf pesan yang profesional tanpa terkesan agresif.
4. **Kehilangan Riwayat Data Akibat Penghapusan Permanen:**  
   Menghapus lamaran yang ditolak merusak akurasi data statistik evaluasi karir.
5. **Navigasi Berbelit & Duplikasi Fitur:**  
   Aplikasi pelacak yang memisahkan arsip dan pengingat ke banyak halaman membuat pengguna malas mendokumentasikan lamaran karena alur yang rumit.

---

## 3. Profil Pengguna (User Persona)

* **Nama Persona:** Budi, The Active Job Seeker
* **Karakteristik:** Fresh graduate atau developer berpengalaman yang sedang aktif melamar ke 30–80 perusahaan per bulan di berbagai platform.
* **Kebutuhan Utama:**
  * Ingin mencatat lamaran instan hanya dengan upload screenshot atau tempel link/teks lowongan.
  * Ingin diingatkan secara otomatis kapan harus follow-up (H+7).
  * Ingin arsip persyaratan kerja asli tetap tersimpan aman meski iklannya sudah terhapus di internet.
  * Ingin satu tampilan papan terpadu tanpa menu berulang.

---

## 4. Alur Perjalanan Pengguna (User Journey)

```
[1. Temukan Lowongan] ──> [2. Upload Screenshot/Link/Teks] ──> [3. AI Auto-Fill & Arsip JD (Maks 20/hari)]
                                                                               │
[6. Interview Prep] <── [5. Auto-Generate Draf Pesan] <── [4. Masuk Kolom Kanban "Applied"]
```

1. **Penemuan:** Pengguna menemukan lowongan kerja di internet (LinkedIn, Glints, Jobstreet, WhatsApp info loker) dan melamar.
2. **Pencatatan Instan (Multimodal):** Pengguna membuka NextRole, mengunggah screenshot gambar, menempelkan URL, atau raw text lowongan.
3. **Ekstraksi Otomatis & Kuota Protektif:** AI (Gemini 1.5 Flash) mengekstrak seluruh data kunci secara terstruktur dan mengisi form review otomatis. Jatah ekstraksi AI dibatasi **20 kali/hari per akun** untuk menjaga kehandalan tier gratis.
4. **Alur Langsung (*Direct Pipeline*):** Lamaran langsung tersimpan di kolom Kanban **`Applied`** (tanpa tahapan *Wishlist* yang menambah friksi).
5. **Pengingat Cerdas:** Pada hari ke-7 tanpa kabar respons, sistem otomatis menandai kartu dan men-generate draf pesan *follow-up* sopan siap salin (Bahasa Indonesia & Inggris).
6. **Persiapan Wawancara:** Saat dipanggil wawancara, pengguna membuka *JD Snapshot* langsung dari kartu untuk mempelajari kembali kualifikasi asli perusahaan.

---

## 5. Fitur Utama & Prioritas (MoSCoW)

### Must Have (Wajib Ada di MVP)
* **Smart Job Clipper (Multimodal: Screenshot Image / URL / Raw Text):** Ekstraksi otomatis data (Perusahaan, Posisi, Lokasi, Tipe Kerja, Rentang Gaji, Skill Kunci, dan Teks Lengkap JD) menggunakan Gemini 1.5 Flash (*Structured Output*).
* **AI Daily Quota Guard (20 Klip/Hari Per Akun):** Batasan protektif 20 ekstraksi AI per hari untuk menjaga operasional 100% gratis ($0 cost) dan mencegah abuse/spam bot. Input manual tetap tersedia gratis tanpa batas.
* **Direct 5-Column Kanban Pipeline (Tanpa Wishlist):** Papan visual alur lamaran kerja langsung berorientasi tindakan:
  1. `Applied` (Dilamar)
  2. `Follow-Up Needed` (Perlu Follow-Up H+7)
  3. `Interview Scheduled` (Wawancara Terjadwal)
  4. `Offered` (Mendapat Penawaran)
  5. `Rejected / Ghosted` (Ditolak / Ghosting)
* **Single Unified Workspace (Anti-Duplikasi Menu):** Papan Kanban menjadi pusat kendali tunggal. Arsip JD dan Follow-Up H+7 tidak dibuatkan halaman menu terpisah di navbar, melainkan terintegrasi kontekstual via **Application Detail Drawer** (panel geser).
* **Permanent JD Snapshot:** Penyimpanan permanen teks lengkap iklan lowongan ke database agar bisa dibaca kapan saja meski iklan asli di internet sudah terhapus.
* **Smart Follow-Up Engine (H+7):** Penandaan otomatis pada hari ke-7 dan generator pesan tindak lanjut profesional dalam 2 bahasa (Bahasa Indonesia & Bahasa Inggris) siap 1-click copy.
* **Soft-Delete Protection:** Menjaga keutuhan riwayat data saat pengguna menghapus kartu.

### Should Have (Fase Berikutnya)
* **Ghosting Auto-Detector (H+14):** Menandai otomatis lamaran yang tidak ada kabar lebih dari 14 hari menjadi status *Presumed Ghosted*.
* **Analytics Metrics Card:** Ringkasan statistik lamaran (Total Applied, Response Rate %, Interview Conversion %).
* **AI Interview Cheat-Sheet:** Generator kisi-kisi 3 pertanyaan teknis berdasarkan isi teks *JD Snapshot*.

### Could Have
* Filter dan pencarian kata kunci cepat di papan Kanban.
* Ekspor data riwayat lamaran ke format CSV / JSON.

### Won't Have (Di Luar Cakupan MVP)
* Integrasi otomatis pengiriman email langsung dari server (pengguna cukup copy-paste draf).
* Sinkronisasi akun multi-platform (cukup 1 akun personal).

---

## 6. Kebutuhan Non-Fungsional (NFR)

* **Kecepatan Ekstraksi AI:** Proses pemrosesan teks atau gambar screenshot lowongan via AI selesai dalam waktu $\le 2$ detik.
* **Zero Cost Infrastructure:** Berjalan 100% di atas tier gratis (Next.js di Vercel, PostgreSQL di Neon, Gemini 1.5 Flash di Google AI Studio).
* **Proteksi Konsumsi API:** Rate limiting 20 request/hari per akun pengguna untuk ekstraksi AI.
* **Keamanan Data:** Bebas dari kerentanan ReDoS (*Zero RegEx Policy*) dan isolasi data per akun pengguna.
* **Responsif:** Antarmuka optimal diakses dari desktop, tablet, dan smartphone.

