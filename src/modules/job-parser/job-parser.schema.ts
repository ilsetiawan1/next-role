import { z } from "zod";

export const extractJobInputSchema = z
  .object({
    inputType: z.enum(["RAW_TEXT", "JOB_URL", "POSTER_IMAGE"]),
    content: z.string().trim().max(25000, "Konten maksimal 25.000 karakter").optional(),
    imageBase64: z.string().max(8_000_000, "Ukuran gambar maksimal 5 MB").optional(),
    mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.inputType === "POSTER_IMAGE") {
      if (!val.imageBase64 || val.imageBase64.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imageBase64"],
          message: "Gambar poster/screenshot lowongan wajib diunggah.",
        });
      }
      if (!val.mimeType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mimeType"],
          message: "Tipe gambar harus PNG, JPG, atau WebP.",
        });
      }
    } else if (!val.content || val.content.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "Teks atau URL lowongan terlalu pendek.",
      });
    }
  });

export const parsedJobPayloadSchema = z.object({
  companyName: z.string().trim().min(1, "Nama perusahaan wajib terdeteksi"),
  position: z.string().trim().min(1, "Posisi pekerjaan wajib terdeteksi"),
  location: z.string().trim().nullable(),
  employmentType: z.string().trim().nullable(),
  salaryRange: z.string().trim().nullable(),
  jobSource: z.string().trim().nullable(),
  keyRequirements: z.array(z.string().trim().min(1)).max(12).default([]),
  jdSnapshot: z.string().trim().min(1, "Ringkasan deskripsi lowongan wajib ada"),
});

export type ExtractJobInput = z.infer<typeof extractJobInputSchema>;
export type ParsedJobPayload = z.infer<typeof parsedJobPayloadSchema>;
