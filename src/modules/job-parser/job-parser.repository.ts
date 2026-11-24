import { Prisma } from "@prisma/client";
import { db } from "@/config/db";

export interface JobParseCacheRecord {
  id: string;
  contentHash: string;
  inputType: string;
  parsedPayload: unknown;
  modelVersion: string;
}

export interface UserQuotaRecord {
  dailyAiClipsCount: number;
  lastClipResetAt: Date;
}

export const jobParserRepository = {
  async findCacheByHash(contentHash: string): Promise<JobParseCacheRecord | null> {
    return db.jobParseCache.findUnique({
      where: { contentHash },
      select: {
        id: true,
        contentHash: true,
        inputType: true,
        parsedPayload: true,
        modelVersion: true,
      },
    });
  },

  async saveCache(data: {
    contentHash: string;
    inputType: string;
    parsedPayload: Prisma.InputJsonValue;
    modelVersion: string;
  }): Promise<void> {
    await db.jobParseCache.upsert({
      where: { contentHash: data.contentHash },
      update: {
        parsedPayload: data.parsedPayload,
        modelVersion: data.modelVersion,
      },
      create: {
        contentHash: data.contentHash,
        inputType: data.inputType,
        parsedPayload: data.parsedPayload,
        modelVersion: data.modelVersion,
      },
    });
  },

  async getUserQuota(userId: string): Promise<UserQuotaRecord | null> {
    return db.user.findUnique({
      where: { id: userId },
      select: {
        dailyAiClipsCount: true,
        lastClipResetAt: true,
      },
    });
  },

  async updateUserQuota(userId: string, count: number, resetAt: Date): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        dailyAiClipsCount: count,
        lastClipResetAt: resetAt,
      },
    });
  },
};
