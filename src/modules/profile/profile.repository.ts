import { db } from "@/config/db";

export interface UserProfileRecord {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  dailyAiClipsCount: number;
  lastClipResetAt: Date;
  cvFileKey: string | null;
  cvFileName: string | null;
  cvHash: string | null;
  cvUpdatedAt: Date | null;
}

export const profileRepository = {
  async findByUserId(userId: string): Promise<UserProfileRecord | null> {
    return db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dailyAiClipsCount: true,
        lastClipResetAt: true,
        cvFileKey: true,
        cvFileName: true,
        cvHash: true,
        cvUpdatedAt: true,
      },
    });
  },

  async updateCvData(
    userId: string,
    data: {
      cvFileKey: string;
      cvFileName: string;
      cvText: string;
      cvHash: string;
      cvUpdatedAt: Date;
    }
  ): Promise<UserProfileRecord> {
    return db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dailyAiClipsCount: true,
        lastClipResetAt: true,
        cvFileKey: true,
        cvFileName: true,
        cvHash: true,
        cvUpdatedAt: true,
      },
    });
  },

  async updateCvEmbedding(userId: string, vectorLiteral: string): Promise<void> {
    await db.$executeRaw`
      UPDATE users
      SET cv_embedding = ${vectorLiteral}::vector
      WHERE id = ${userId}
    `;
  },

  async clearCv(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        cvFileKey: null,
        cvFileName: null,
        cvText: null,
        cvHash: null,
        cvUpdatedAt: null,
      },
    });

    await db.$executeRaw`
      UPDATE users
      SET cv_embedding = NULL
      WHERE id = ${userId}
    `;
  },
};
