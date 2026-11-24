import { db } from "@/config/db";
import { GUEST_EMAIL_DOMAIN } from "@/constants/application";
import { calculateFollowUpDate } from "@/utils/date";
import {
  buildDemoBaseVectorLiteral,
  buildDemoJdVectorLiteral,
  DEMO_APPLICATIONS_SEED,
} from "./auth.demo-seed";

export interface AuthUserRecord {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  passwordHash: string | null;
}

export const authRepository = {
  async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
      },
    });
  },

  async findUserById(id: string): Promise<AuthUserRecord | null> {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
      },
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash?: string | null;
    image?: string | null;
  }): Promise<AuthUserRecord> {
    return db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash ?? null,
        image: data.image ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
      },
    });
  },

  async upsertOAuthUser(data: {
    email: string;
    name?: string | null;
    image?: string | null;
    provider: string;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null;
    tokenType?: string | null;
    scope?: string | null;
    idToken?: string | null;
  }): Promise<AuthUserRecord> {
    const user = await db.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name ?? undefined,
        image: data.image ?? undefined,
        emailVerified: new Date(),
      },
      create: {
        email: data.email,
        name: data.name ?? null,
        image: data.image ?? null,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
      },
    });

    await db.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      },
      update: {
        access_token: data.accessToken ?? undefined,
        refresh_token: data.refreshToken ?? undefined,
        expires_at: data.expiresAt ?? undefined,
        token_type: data.tokenType ?? undefined,
        scope: data.scope ?? undefined,
        id_token: data.idToken ?? undefined,
      },
      create: {
        userId: user.id,
        type: "oauth",
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        access_token: data.accessToken ?? null,
        refresh_token: data.refreshToken ?? null,
        expires_at: data.expiresAt ?? null,
        token_type: data.tokenType ?? null,
        scope: data.scope ?? null,
        id_token: data.idToken ?? null,
      },
    });

    return user;
  },

  async deleteExpiredGuestUsers(cutoffDate: Date): Promise<void> {
    await db.user.deleteMany({
      where: {
        email: { endsWith: GUEST_EMAIL_DOMAIN },
        createdAt: { lt: cutoffDate },
      },
    });
  },

  async seedGuestWorkspace(userId: string): Promise<void> {
    const now = new Date();
    const baseVector = buildDemoBaseVectorLiteral();

    await db.user.update({
      where: { id: userId },
      data: {
        cvFileName: "CV_Demo_NextRole.pdf",
        cvText:
          "Fullstack Web Developer berpengalaman 4 tahun di React, Next.js, TypeScript, Tailwind CSS, Node.js, dan PostgreSQL.",
        cvUpdatedAt: now,
      },
    });

    await db.$executeRaw`
      UPDATE users
      SET cv_embedding = ${baseVector}::vector
      WHERE id = ${userId}
    `;

    for (const item of DEMO_APPLICATIONS_SEED) {
      const appliedAt = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
      const followUpAt = calculateFollowUpDate(appliedAt);

      const created = await db.application.create({
        data: {
          userId,
          companyName: item.companyName,
          position: item.position,
          location: item.location,
          employmentType: item.employmentType,
          salaryRange: item.salaryRange,
          jobSource: item.jobSource,
          keyRequirements: item.keyRequirements,
          jdSnapshot: item.jdSnapshot,
          status: item.status,
          appliedAt,
          followUpAt,
          recruiterName: item.recruiterName,
          recruiterContact: item.recruiterContact,
          activities: {
            create: {
              actionType: item.status,
              notes: `Data sampel Mode Demo (${item.companyName} — ${item.position}).`,
            },
          },
        },
        select: { id: true },
      });

      const jdVector = buildDemoJdVectorLiteral(item.targetSimilarity);
      await db.$executeRaw`
        UPDATE applications
        SET jd_embedding = ${jdVector}::vector
        WHERE id = ${created.id}
      `;
    }
  },
};
