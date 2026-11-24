import { z } from "zod";

export const generateFollowUpSchema = z.object({
  applicationId: z.string().uuid("ID lamaran tidak valid"),
  language: z.enum(["id", "en"]).default("id"),
  tone: z.enum(["formal", "casual"]).default("formal"),
});

export const followUpDraftSchema = z.object({
  subject: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

export type GenerateFollowUpInput = z.infer<typeof generateFollowUpSchema>;
export type FollowUpDraft = z.infer<typeof followUpDraftSchema>;
