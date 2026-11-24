export const followUpOpenApiPaths = {
  "/api/v1/follow-up/generate": {
    post: {
      tags: ["Follow-Up"],
      summary: "Buat draf pesan follow-up sopan (ID/EN) & hitung status H+7",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["applicationId"],
              properties: {
                applicationId: { type: "string", format: "uuid" },
                language: { type: "string", enum: ["id", "en"], default: "id" },
                tone: { type: "string", enum: ["formal", "casual"], default: "formal" },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Draf pesan follow-up & informasi jadwal H+7 berhasil dibuat" },
        "401": { description: "Sesi belum terautentikasi" },
        "404": { description: "Lamaran tidak ditemukan" },
      },
    },
  },
} as const;
