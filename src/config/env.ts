import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL wajib diisi"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY wajib diisi"),
  R2_ACCOUNT_ID: z.string().min(1, "R2_ACCOUNT_ID wajib diisi"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID wajib diisi"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY wajib diisi"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME wajib diisi"),
  R2_ENDPOINT: z.string().url("R2_ENDPOINT harus berupa URL yang valid"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET wajib diisi"),
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID wajib diisi"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET wajib diisi"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

/**
 * Mengambil dan memvalidasi environment variables sisi server secara aman.
 */
export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Konfigurasi environment server belum lengkap: ${missing}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}
