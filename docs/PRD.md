# Product Requirements Document (PRD) — NextRole

> **Status:** Approved / Ready for Architecture  
> **Versi:** 1.0.0  
> **Target Rilis:** Q4 2026  
> **Owner:** Fullstack Product Engineering

---

## 1. Ringkasan Eksekutif & Visi Produk

**NextRole** adalah platform asisten karir cerdas berbasis web (*Intelligent Job Hunt Assistant*) yang dirancang khusus untuk mengotomatisasi proses pelacakan lamaran kerja, menjaga etika komunikasi dengan perekrut, dan mempersiapkan kandidat menghadapi tahapan wawancara tanpa stres.

### Visi Produk
Mengubah proses pencarian kerja yang sebelumnya kacau, serba manual (spreadsheet/Notion), dan rentan lupa menjadi alur kerja yang teratur, proaktif, dan terotomatisasi secara cerdas.

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

---

## 3. Profil Pengguna (User Persona)

* **Nama Persona:** Budi, The Active Job Seeker
* **Karakteristik:** Fresh graduate atau developer berpengalaman yang sedang aktif melamar ke 30–80 perusahaan per bulan di berbagai platform.
* **Kebutuhan Utama:**
  * Ingin mencatat lamaran dalam hitungan detik.
  * Ingin diingatkan secara otomatis kapan harus follow-up.
  * Ingin arsip persyaratan kerja tetap aman meski iklannya sudah terhapus di internet.

---

## 4. Alur Perjalanan Pengguna (User Journey)

```
[1. Temukan Lowongan] ──> [2. Tempel Link/Teks ke NextRole] ──> [3. AI Isi Form & Arsip JD] 
                                                                         │
[6. Interview Prep] <── [5. Auto-Generate Draf Pesan] <── [4. H+7 Notifikasi Follow-Up]
```

1. **Penemuan:** Pengguna menemukan lowongan kerja di internet dan melamar.
2. **Pencatatan Instan:** Pengguna membuka NextRole, menempelkan link/teks lowongan.
3. **Ekstraksi Otomatis:** AI mengekstrak data kunci dan mengarsipkan teks lengkap persyaratan kerja (*JD Snapshot*).
4. **Pemantauan Pasif:** Kartu lamaran masuk ke kolom Kanban `Applied`.
5. **Pengingat Cerdas:** Pada hari ke-7 tanpa kabar, sistem menandai kartu dan men-generate draf pesan *follow-up* sopan siap kirim.
6. **Persiapan Wawancara:** Saat dipanggil wawancara, pengguna membuka tab *JD Snapshot* untuk mempelajari kembali kualifikasi asli perusahaan.

---

## 5. Fitur Utama & Prioritas (MoSCoW)

### Must Have (Wajib Ada di MVP)
* **Smart Job Clipper (URL / Raw Text):** Ekstraksi otomatis data (Perusahaan, Posisi, Lokasi, Tipe Kerja, Skill Kunci) menggunakan AI terstruktur (*Structured Output*).
* **Permanent JD Snapshot:** Penyimpanan permanen teks lengkap iklan lowongan ke database agar bisa dibaca kapan saja.
* **Interactive Kanban Pipeline:** Papan visual alur lamaran dengan kolom: `Wishlist`, `Applied`, `Follow-Up Needed`, `Interview`, `Offered`, `Rejected / Ghosted`.
* **Smart Follow-Up Engine (H+7):** Penandaan otomatis pada hari ke-7 dan generator pesan tindak lanjut profesional dalam Bahasa Indonesia dan Bahasa Inggris.
* **Soft-Delete Protection:** Menjaga keutuhan riwayat data saat pengguna menghapus kartu.

### Should Have (Fase Berikutnya)
* **Ghosting Auto-Detector (H+14):** Menandai otomatis lamaran yang tidak ada kabar lebih dari 14 hari menjadi status *Presumed Ghosted*.
* **Analytics Metrics Card:** Ringkasan statistik lamaran (Total Applied, Response Rate %, Interview Conversion %).
* **AI Interview Cheat-Sheet:** Generator kisi-kisi 3 pertanyaan teknis berdasarkan isi teks *JD Snapshot*.

### Could Have
* Filter dan pencarian kata kunci di papan Kanban.
* Ekspor data riwayat lamaran ke format CSV / JSON.

### Won't Have (Di Luar Cakupan MVP)
* Integrasi otomatis pengiriman email langsung dari server (pengguna cukup copy-paste draf).
* Sinkronisasi akun multi-platform (cukup 1 akun personal).

---

## 6. Kebutuhan Non-Fungsional (NFR)

* **Kecepatan Ekstraksi AI:** Proses pemrosesan teks lowongan via AI selesai dalam waktu $\le 2$ detik.
* **Zero Cost Infrastructure:** Berjalan 100% di atas tier gratis (Next.js di Vercel, PostgreSQL di Neon, Gemini 1.5 Flash di Google AI Studio).
* **Keamanan Data:** Bebas dari kerentanan ReDoS (*Zero RegEx Policy*) dan isolasi data per akun pengguna.
* **Responsif:** Antarmuka optimal diakses dari desktop dan perangkat mobile.

