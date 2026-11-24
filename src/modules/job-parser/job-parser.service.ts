import { generateObject } from "ai";
import { Prisma } from "@prisma/client";
import { AI_MODELS, getGoogleAI } from "@/config/ai";
import { ERROR_MESSAGES, MAX_DAILY_AI_CLIPS } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { isSameUtcDay } from "@/utils/date";
import { normalizeWhitespace } from "@/utils/format";
import { sha256Hex } from "@/utils/hash";
import { jobParserRepository } from "./job-parser.repository";
import {
  parsedJobPayloadSchema,
  type ExtractJobInput,
  type ParsedJobPayload,
} from "./job-parser.schema";

export interface JobParserRepositoryPort {
  findCacheByHash: typeof jobParserRepository.findCacheByHash;
  saveCache: typeof jobParserRepository.saveCache;
  getUserQuota: typeof jobParserRepository.getUserQuota;
  updateUserQuota: typeof jobParserRepository.updateUserQuota;
}

export type JobAiExtractor = (rawText: string, sourceUrl?: string) => Promise<ParsedJobPayload>;
export type JobUrlFetcher = (url: string) => Promise<string>;

/**
 * Memvalidasi URL lowongan secara aman tanpa RegEx serta memblokir target privat/localhost.
 */
export function validateSafeJobUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new AppError(400, "Format URL lowongan tidak valid.", "INVALID_URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new AppError(400, "URL lowongan harus menggunakan protokol http atau https.", "INVALID_URL");
  }

  const host = parsed.hostname.toLowerCase();
  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  const blockedPrefixes = ["10.", "127.", "169.254.", "192.168."];
  if (
    blockedHosts.includes(host) ||
    blockedPrefixes.some((prefix) => host.startsWith(prefix)) ||
    host.endsWith(".local")
  ) {
    throw new AppError(400, "Host URL tidak diizinkan.", "BLOCKED_URL");
  }

  return parsed;
}

/**
 * Mengambil teks polos dari HTML tanpa RegEx (Zero RegEx Policy).
 */
export function stripHtmlToText(html: string): string {
  const lower = html.toLowerCase();
  const output: string[] = [];
  let i = 0;
  let inTag = false;

  while (i < html.length) {
    if (!inTag && html[i] === "<") {
      if (lower.startsWith("<script", i)) {
        const endIdx = lower.indexOf("</script>", i);
        i = endIdx === -1 ? html.length : endIdx + 9;
        continue;
      }
      if (lower.startsWith("<style", i)) {
        const endIdx = lower.indexOf("</style>", i);
        i = endIdx === -1 ? html.length : endIdx + 8;
        continue;
      }
      inTag = true;
      output.push(" ");
      i += 1;
      continue;
    }

    if (inTag) {
      if (html[i] === ">") {
        inTag = false;
      }
      i += 1;
      continue;
    }

    const ch = html[i];
    output.push(ch === "\n" || ch === "\r" || ch === "\t" ? " " : ch);
    i += 1;
  }

  return normalizeWhitespace(output.join(""));
}

async function defaultFetchJobUrl(url: string): Promise<string> {
  const safeUrl = validateSafeJobUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(safeUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "NextRoleJobClipper/1.0",
        Accept: "text/html, text/plain;q=0.9",
      },
    });

    if (!res.ok) {
      throw new AppError(
        422,
        "Halaman lowongan tidak dapat diakses otomatis. Silakan copy-paste teks lowongan secara langsung.",
        "URL_FETCH_FAILED"
      );
    }

    const html = await res.text();
    const plain = stripHtmlToText(html).slice(0, 20000);
    if (plain.length < 30) {
      throw new AppError(
        422,
        "Konten teks lowongan tidak ditemukan dari URL tersebut. Silakan paste teks lowongan secara langsung.",
        "URL_EMPTY_CONTENT"
      );
    }
    return plain;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      422,
      "Gagal mengambil halaman lowongan. Silakan copy-paste teks lowongan secara langsung.",
      "URL_FETCH_FAILED"
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function defaultAiExtract(rawText: string, sourceUrl?: string): Promise<ParsedJobPayload> {
  const google = getGoogleAI();
  const prompt = [
    "Ekstrak informasi lowongan kerja berikut ke format JSON terstruktur.",
    "Jangan mengarang data. Jika informasi tidak disebutkan (misal gaji atau lokasi), isi null.",
    "Isi keyRequirements dengan maksimal 8 poin syarat/keahlian utama yang singkat.",
    "Isi jdSnapshot dengan arsip teks deskripsi lowongan yang bersih dan rapi.",
    sourceUrl ? `URL Sumber: ${sourceUrl}` : "",
    "--- TEKS LOWONGAN ---",
    rawText.slice(0, 18000),
  ]
    .filter(Boolean)
    .join("\n");

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const { object } = await generateObject({
        model: google(AI_MODELS.PARSER_AND_DRAFT),
        schema: parsedJobPayloadSchema,
        prompt,
      });
      return parsedJobPayloadSchema.parse(object);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("[JOB_PARSER_AI_ERROR]", lastError);
  throw new AppError(
    502,
    "AI gagal mengekstrak data lowongan. Silakan coba lagi atau lengkapi form secara manual.",
    "AI_EXTRACTION_FAILED"
  );
}

export interface ExtractJobResult {
  data: ParsedJobPayload;
  meta: {
    cached: boolean;
    quotaUsed: number;
    quotaLimit: number;
  };
}

export function createJobParserService(deps?: {
  repo?: JobParserRepositoryPort;
  aiExtract?: JobAiExtractor;
  fetchUrl?: JobUrlFetcher;
  now?: () => Date;
}) {
  const repo = deps?.repo ?? jobParserRepository;
  const aiExtract = deps?.aiExtract ?? defaultAiExtract;
  const fetchUrl = deps?.fetchUrl ?? defaultFetchJobUrl;
  const getNow = deps?.now ?? (() => new Date());

  return {
    async extract(userId: string, input: ExtractJobInput): Promise<ExtractJobResult> {
      const normalizedContent = normalizeWhitespace(input.content);
      const contentHash = sha256Hex(`${input.inputType}:${normalizedContent}`);
      const now = getNow();

      const quotaRecord = await repo.getUserQuota(userId);
      if (!quotaRecord) {
        throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
      }

      const sameDay = isSameUtcDay(quotaRecord.lastClipResetAt, now);
      const currentQuotaUsed = sameDay ? quotaRecord.dailyAiClipsCount : 0;

      // 1. Cek cache deduplikasi SHA-256 (cache hit = 0 panggilan Gemini & 0 pengurangan kuota)
      const cached = await repo.findCacheByHash(contentHash);
      if (cached) {
        const parsedCache = parsedJobPayloadSchema.safeParse(cached.parsedPayload);
        if (parsedCache.success) {
          return {
            data: parsedCache.data,
            meta: {
              cached: true,
              quotaUsed: currentQuotaUsed,
              quotaLimit: MAX_DAILY_AI_CLIPS,
            },
          };
        }
      }

      // 2. Cek batas kuota harian 20 klip/hari
      if (currentQuotaUsed >= MAX_DAILY_AI_CLIPS) {
        throw new AppError(429, ERROR_MESSAGES.QUOTA_EXCEEDED, "RATE_LIMITED");
      }

      // 3. Siapkan teks mentah (jika URL, fetch teks secara aman)
      const sourceUrl = input.inputType === "JOB_URL" ? validateSafeJobUrl(input.content).toString() : undefined;
      const rawText = sourceUrl ? await fetchUrl(sourceUrl) : normalizedContent;

      // 4. Ekstraksi AI dengan retry guard
      const extracted = await aiExtract(rawText, sourceUrl);

      // 5. Simpan ke JobParseCache dan perbarui kuota harian user
      await repo.saveCache({
        contentHash,
        inputType: input.inputType,
        parsedPayload: extracted as unknown as Prisma.InputJsonValue,
        modelVersion: AI_MODELS.PARSER_AND_DRAFT,
      });

      const nextQuotaUsed = currentQuotaUsed + 1;
      await repo.updateUserQuota(
        userId,
        nextQuotaUsed,
        sameDay ? quotaRecord.lastClipResetAt : now
      );

      return {
        data: extracted,
        meta: {
          cached: false,
          quotaUsed: nextQuotaUsed,
          quotaLimit: MAX_DAILY_AI_CLIPS,
        },
      };
    },
  };
}

export const jobParserService = createJobParserService();
