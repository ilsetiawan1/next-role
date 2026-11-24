export const applicationsOpenApiPaths = {
  "/api/v1/applications": {
    get: {
      tags: ["Applications"],
      summary: "Daftar semua lamaran aktif milik user beserta matchScore pgvector (0-100)",
      parameters: [
        {
          name: "status",
          in: "query",
          schema: {
            type: "string",
            enum: ["APPLIED", "FOLLOW_UP_NEEDED", "INTERVIEW_SCHEDULED", "OFFERED", "REJECTED", "GHOSTED"],
          },
        },
        {
          name: "q",
          in: "query",
          schema: { type: "string" },
          description: "Pencarian berdasarkan nama perusahaan, posisi, atau lokasi",
        },
      ],
      responses: {
        "200": { description: "Daftar lamaran berhasil diambil" },
        "401": { description: "Sesi belum terautentikasi" },
      },
    },
    post: {
      tags: ["Applications"],
      summary: "Simpan lamaran baru dengan status APPLIED & generate vektor JD (768d)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["companyName", "position"],
              properties: {
                companyName: { type: "string", example: "PT Teknologi Nusantara" },
                position: { type: "string", example: "Frontend Engineer" },
                location: { type: "string", nullable: true, example: "Jakarta (Hybrid)" },
                employmentType: { type: "string", nullable: true, example: "Full-time" },
                salaryRange: { type: "string", nullable: true, example: "Rp 15.000.000 - Rp 20.000.000" },
                jobSource: { type: "string", nullable: true, example: "LinkedIn" },
                jobUrl: { type: "string", format: "uri", nullable: true },
                keyRequirements: { type: "array", items: { type: "string" } },
                jdSnapshot: { type: "string", nullable: true },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Lamaran berhasil disimpan" },
        "400": { description: "Payload tidak valid" },
        "401": { description: "Sesi belum terautentikasi" },
      },
    },
  },
  "/api/v1/applications/{id}": {
    get: {
      tags: ["Applications"],
      summary: "Ambil detail lamaran beserta riwayat ActivityLog & matchScore",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "200": { description: "Detail lamaran" },
        "404": { description: "Lamaran tidak ditemukan" },
      },
    },
    patch: {
      tags: ["Applications"],
      summary: "Perbarui detail lamaran milik user",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "200": { description: "Lamaran berhasil diperbarui" },
        "404": { description: "Lamaran tidak ditemukan" },
      },
    },
    delete: {
      tags: ["Applications"],
      summary: "Soft-delete lamaran (mengisi deletedAt)",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "200": { description: "Lamaran berhasil diarsipkan (soft-delete)" },
        "404": { description: "Lamaran tidak ditemukan" },
      },
    },
  },
  "/api/v1/applications/{id}/status": {
    patch: {
      tags: ["Applications"],
      summary: "Pindahkan status Kanban lamaran dan catat ActivityLog",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: ["APPLIED", "FOLLOW_UP_NEEDED", "INTERVIEW_SCHEDULED", "OFFERED", "REJECTED", "GHOSTED"],
                },
                interviewAt: { type: "string", format: "date-time", nullable: true },
                notes: { type: "string", nullable: true },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Status lamaran berhasil diperbarui" },
        "404": { description: "Lamaran tidak ditemukan" },
      },
    },
  },
} as const;
