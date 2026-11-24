import { z } from "zod";

export const extractJobInputSchema = z.object({
  inputType: z.enum(["RAW_TEXT", "JOB_URL"]),
  content: z
    .string()
    .trim()
    .min(10, "Teks atau URL lowongan terlalu pendek")
    .max(25000, "Konten maksimal 25.000 karakter"),
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
