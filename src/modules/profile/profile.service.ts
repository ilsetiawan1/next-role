import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extractText } from "unpdf";
import { generateEmbedding768 } from "@/config/ai";
import { getR2BucketName, getR2Client } from "@/config/r2";
import {
  ERROR_MESSAGES,
  getClipQuotaLimitForEmail,
  isGuestEmail,
  MAX_CV_FILE_SIZE_BYTES,
} from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { isSameUtcDay } from "@/utils/date";
import { normalizeWhitespace, sanitizeFileName } from "@/utils/format";
import { sha256Hex } from "@/utils/hash";
import { toVectorLiteral } from "@/utils/vector";
import { applicationsService } from "@/modules/applications/applications.service";
import { profileRepository, type UserProfileRecord } from "./profile.repository";

const PRESIGNED_URL_EXPIRY_SECONDS = 300; // 5 menit

export interface ProfileRepositoryPort {
  findByUserId: typeof profileRepository.findByUserId;
  updateCvData: typeof profileRepository.updateCvData;
  updateCvEmbedding: typeof profileRepository.updateCvEmbedding;
  clearCv: typeof profileRepository.clearCv;
}

export interface R2StoragePort {
  putObject(key: string, body: Buffer, contentType: string): Promise<void>;
  deleteObject(key: string): Promise<void>;
  getPresignedDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;
}

export type PdfTextExtractor = (buffer: Buffer) => Promise<string>;
export type CvEmbeddingGenerator = (text: string) => Promise<number[]>;

const defaultR2Storage: R2StoragePort = {
  async putObject(key, body, contentType) {
    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
  },

  async deleteObject(key) {
    const client = getR2Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
      })
    );
  },

  async getPresignedDownloadUrl(key, expiresInSeconds) {
    const client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    });
    return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  },
};

async function defaultExtractPdfText(buffer: Buffer): Promise<string> {
  const result = await extractText(new Uint8Array(buffer), { mergePages: true });
  const raw = Array.isArray(result.text) ? result.text.join(" ") : result.text;
  return normalizeWhitespace(raw ?? "");
}

function isPdfMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 5) return false;
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

function formatProfileResponse(profile: UserProfileRecord, now: Date) {
  const sameDay = isSameUtcDay(profile.lastClipResetAt, now);
  const demoExpiresAt =
    isGuestEmail(profile.email) && profile.createdAt
      ? new Date(profile.createdAt.getTime() + 24 * 60 * 60 * 1000)
      : null;

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    image: profile.image,
    demoExpiresAt,
    serverNowMs: now.getTime(),
    quota: {
      used: sameDay ? profile.dailyAiClipsCount : 0,
      limit: getClipQuotaLimitForEmail(profile.email),
    },
    cv: profile.cvFileKey
      ? {
          fileName: profile.cvFileName,
          updatedAt: profile.cvUpdatedAt,
          hasCv: true,
          textPreview: profile.cvText
            ? profile.cvText.length > 220
              ? `${profile.cvText.slice(0, 220)}...`
              : profile.cvText
            : null,
        }
      : {
          fileName: null,
          updatedAt: null,
          hasCv: false,
          textPreview: null,
        },
  };
}

export function createProfileService(deps?: {
  repo?: ProfileRepositoryPort;
  storage?: R2StoragePort;
  extractPdfText?: PdfTextExtractor;
  generateEmbedding?: CvEmbeddingGenerator;
  reembedUserApplications?: (userId: string) => Promise<void>;
  now?: () => Date;
}) {
  const repo = deps?.repo ?? profileRepository;
  const storage = deps?.storage ?? defaultR2Storage;
  const extractPdf = deps?.extractPdfText ?? defaultExtractPdfText;
  const generateEmbedding = deps?.generateEmbedding ?? generateEmbedding768;
  const reembedUserApplications =
    deps?.reembedUserApplications ??
    ((uid: string) => applicationsService.reembedUserApplications(uid));
  const getNow = deps?.now ?? (() => new Date());

  return {
    async getProfile(userId: string) {
      const profile = await repo.findByUserId(userId);
      if (!profile) {
        throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
      }
      return formatProfileResponse(profile, getNow());
    },

    async uploadCv(
      userId: string,
      file: { name: string; type: string; size: number; buffer: Buffer }
    ) {
      if (file.size <= 0) {
        throw new AppError(400, "File CV tidak boleh kosong.", "EMPTY_FILE");
      }

      if (file.size > MAX_CV_FILE_SIZE_BYTES) {
        throw new AppError(413, ERROR_MESSAGES.PDF_TOO_LARGE, "PDF_TOO_LARGE");
      }

      const lowerName = file.name.toLowerCase();
      const validMimeOrExt = file.type === "application/pdf" || lowerName.endsWith(".pdf");
      if (!validMimeOrExt || !isPdfMagicBytes(file.buffer)) {
        throw new AppError(400, ERROR_MESSAGES.PDF_ONLY, "PDF_ONLY");
      }

      const existing = await repo.findByUserId(userId);
      if (!existing) {
        throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
      }

      // Ekstrak teks PDF sebelum upload agar PDF scan/kosong ditolak lebih awal
      const extractedText = await extractPdf(file.buffer);
      if (extractedText.length < 20) {
        throw new AppError(
          422,
          "PDF tidak memiliki teks yang dapat dibaca. Pastikan CV bukan hasil scan gambar.",
          "PDF_TEXT_EMPTY"
        );
      }

      const now = getNow();
      const safeName = sanitizeFileName(file.name);
      const newKey = `cvs/${userId}/${now.getTime()}-${safeName}`;

      // Upload ke Cloudflare R2 Private Bucket
      await storage.putObject(newKey, file.buffer, "application/pdf");

      // Hapus objek CV lama di R2 secara best-effort
      if (existing.cvFileKey && existing.cvFileKey !== newKey) {
        try {
          await storage.deleteObject(existing.cvFileKey);
        } catch (error) {
          console.error("[R2_DELETE_OLD_CV_WARNING]", error);
        }
      }

      const cvHash = sha256Hex(extractedText);
      const updated = await repo.updateCvData(userId, {
        cvFileKey: newKey,
        cvFileName: file.name,
        cvText: extractedText,
        cvHash,
        cvUpdatedAt: now,
      });

      // Hanya generate vektor embedding baru jika isi teks CV berubah (hemat token)
      const reembedded = cvHash !== existing.cvHash;
      if (reembedded) {
        const vector = await generateEmbedding(extractedText);
        await repo.updateCvEmbedding(userId, toVectorLiteral(vector));
      }

      // Pada akun Guest Demo, lamaran sampel awalnya memakai vektor sintetis (0 AI call saat login).
      // Saat user mengunggah CV PDF asli, hitung ulang vektor JD sampel agar skor kecocokan akurat.
      if (isGuestEmail(existing.email)) {
        try {
          await reembedUserApplications(userId);
        } catch (error) {
          console.error("[GUEST_REEMBED_APPLICATIONS_WARNING]", error);
        }
      }

      return {
        ...formatProfileResponse(updated, now),
        reembedded,
      };
    },

    async getCvPreviewUrl(userId: string) {
      const profile = await repo.findByUserId(userId);
      if (!profile) {
        throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
      }

      if (!profile.cvFileKey) {
        throw new AppError(404, "Belum ada CV yang diunggah.", "CV_NOT_FOUND");
      }

      const url = await storage.getPresignedDownloadUrl(
        profile.cvFileKey,
        PRESIGNED_URL_EXPIRY_SECONDS
      );

      return {
        url,
        fileName: profile.cvFileName,
        expiresInSeconds: PRESIGNED_URL_EXPIRY_SECONDS,
      };
    },

    async deleteCv(userId: string) {
      const profile = await repo.findByUserId(userId);
      if (!profile) {
        throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
      }

      if (profile.cvFileKey) {
        try {
          await storage.deleteObject(profile.cvFileKey);
        } catch (error) {
          console.error("[R2_DELETE_CV_WARNING]", error);
        }
      }

      await repo.clearCv(userId);
      return { deleted: true };
    },
  };
}

export const profileService = createProfileService();
