import { generateObject } from "ai";
import { AI_MODELS, getGoogleAI } from "@/config/ai";
import { FOLLOW_UP_DAYS_THRESHOLD } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { applicationsService } from "@/modules/applications/applications.service";
import type { ApplicationRecord } from "@/modules/applications/applications.repository";
import { calculateFollowUpDate } from "@/utils/date";
import {
  followUpDraftSchema,
  type FollowUpDraft,
  type GenerateFollowUpInput,
} from "./follow-up.schema";

export interface FollowUpApplicationsPort {
  getApplicationById(userId: string, id: string): Promise<ApplicationRecord>;
  recordFollowUpDraft(userId: string, id: string, language: "id" | "en"): Promise<void>;
}

export type FollowUpDraftGenerator = (params: {
  companyName: string;
  position: string;
  recruiterName: string | null;
  appliedAt: Date;
  language: "id" | "en";
  tone: "formal" | "casual";
}) => Promise<FollowUpDraft>;

/**
 * Menghitung apakah lamaran sudah melewati ambang H+7 sejak tanggal melamar.
 */
export function evaluateFollowUpStatus(appliedAt: Date, now: Date = new Date()) {
  const followUpDate = calculateFollowUpDate(appliedAt, FOLLOW_UP_DAYS_THRESHOLD);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceApplied = Math.max(0, Math.floor((now.getTime() - appliedAt.getTime()) / msPerDay));
  return {
    daysSinceApplied,
    recommendedFollowUpAt: followUpDate,
    isDue: now.getTime() >= followUpDate.getTime(),
  };
}

async function defaultGenerateDraft(params: {
  companyName: string;
  position: string;
  recruiterName: string | null;
  appliedAt: Date;
  language: "id" | "en";
  tone: "formal" | "casual";
}): Promise<FollowUpDraft> {
  const google = getGoogleAI();
  const langLabel = params.language === "id" ? "Bahasa Indonesia" : "English";
  const toneLabel = params.tone === "formal" ? "profesional dan sopan" : "ramah namun tetap profesional";
  const appliedDateStr = params.appliedAt.toISOString().slice(0, 10);

  const prompt = [
    `Buatkan draf pesan email/chat follow-up lamaran kerja dalam ${langLabel} dengan nada ${toneLabel}.`,
    `Perusahaan: ${params.companyName}`,
    `Posisi: ${params.position}`,
    `Tanggal melamar: ${appliedDateStr}`,
    params.recruiterName ? `Nama rekruter: ${params.recruiterName}` : "Nama rekruter tidak diketahui (gunakan sapaan umum yang sopan).",
    "Buat pesan ringkas (3-4 kalimat), tidak memaksa, dan siap langsung dikirim oleh pelamar.",
  ].join("\n");

  try {
    const { object } = await generateObject({
      model: google(AI_MODELS.PARSER_AND_DRAFT),
      schema: followUpDraftSchema,
      prompt,
    });
    return followUpDraftSchema.parse(object);
  } catch (error) {
    console.error("[FOLLOW_UP_AI_ERROR]", error);
    throw new AppError(
      502,
      "Gagal membuat draf pesan follow-up. Silakan coba lagi beberapa saat.",
      "FOLLOW_UP_GENERATION_FAILED"
    );
  }
}

export function createFollowUpService(deps?: {
  applications?: FollowUpApplicationsPort;
  generateDraft?: FollowUpDraftGenerator;
  now?: () => Date;
}) {
  const apps = deps?.applications ?? applicationsService;
  const generateDraft = deps?.generateDraft ?? defaultGenerateDraft;
  const getNow = deps?.now ?? (() => new Date());

  return {
    async generate(userId: string, input: GenerateFollowUpInput) {
      const app = await apps.getApplicationById(userId, input.applicationId);
      const timing = evaluateFollowUpStatus(app.appliedAt, getNow());

      const draft = await generateDraft({
        companyName: app.companyName,
        position: app.position,
        recruiterName: app.recruiterName,
        appliedAt: app.appliedAt,
        language: input.language,
        tone: input.tone,
      });

      await apps.recordFollowUpDraft(userId, app.id, input.language);

      return {
        applicationId: app.id,
        language: input.language,
        tone: input.tone,
        timing,
        draft,
      };
    },
  };
}

export const followUpService = createFollowUpService();
