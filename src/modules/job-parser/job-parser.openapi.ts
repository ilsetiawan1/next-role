export const jobParserOpenApiPaths = {
  "/api/v1/parser/extract": {
    post: {
      tags: ["Job Parser"],
      summary: "Ekstrak detail lowongan kerja dari teks mentah atau URL menggunakan AI",
      description:
        "Menggunakan SHA-256 deduplication cache (`JobParseCache`). Cache hit tidak memanggil Gemini dan tidak mengurangi kuota harian 20 klip/hari.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["inputType"],
              properties: {
                inputType: { type: "string", enum: ["RAW_TEXT", "JOB_URL", "POSTER_IMAGE"] },
                content: {
                  type: "string",
                  example: "PT Teknologi Nusantara membuka lowongan Frontend Engineer (Next.js, TypeScript) di Jakarta, gaji Rp 15-20 juta.",
                },
                imageBase64: { type: "string", description: "Base64 poster/screenshot lowongan (untuk POSTER_IMAGE)" },
                mimeType: { type: "string", enum: ["image/png", "image/jpeg", "image/webp"] },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Hasil ekstraksi terstruktur beserta status cache & kuota" },
        "400": { description: "Payload atau URL tidak valid" },
        "401": { description: "Sesi belum terautentikasi" },
        "429": { description: "Kuota harian 20 klip AI telah tercapai" },
      },
    },
  },
} as const;
