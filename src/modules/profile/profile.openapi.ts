export const profileOpenApiPaths = {
  "/api/v1/profile": {
    get: {
      tags: ["Profile & CV"],
      summary: "Ambil profil user, sisa kuota klip AI harian, dan status CV aktif",
      responses: {
        "200": { description: "Profil user berhasil diambil" },
        "401": { description: "Sesi belum terautentikasi" },
      },
    },
  },
  "/api/v1/profile/cv": {
    put: {
      tags: ["Profile & CV"],
      summary: "Unggah atau perbarui CV PDF (maks 5 MB) ke R2 Private Bucket & hitung embedding 768d",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary", description: "File CV berformat PDF (maks 5 MB)" },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "CV berhasil diunggah & diproses" },
        "400": { description: "File bukan PDF valid" },
        "413": { description: "Ukuran file melebihi 5 MB" },
        "422": { description: "PDF tidak memiliki teks yang dapat dibaca" },
      },
    },
    delete: {
      tags: ["Profile & CV"],
      summary: "Hapus file CV dari R2 Private Bucket dan kosongkan embedding di database",
      responses: {
        "200": { description: "CV berhasil dihapus" },
      },
    },
  },
  "/api/v1/profile/cv/preview": {
    get: {
      tags: ["Profile & CV"],
      summary: "Dapatkan Presigned URL sementara (berumur 5 menit) untuk pratinjau CV PDF",
      responses: {
        "200": { description: "Presigned URL berhasil dibuat" },
        "404": { description: "Belum ada CV yang diunggah" },
      },
    },
  },
} as const;
