import { ApplicationStatus } from "@prisma/client";
import { db } from "@/config/db";
import type { ApplicationStatusType } from "@/constants/application";
import { cosineDistanceToMatchScore } from "@/utils/vector";

export interface ActivityLogItem {
  id: string;
  actionType: string;
  notes: string | null;
  createdAt: Date;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  jobSource: string | null;
  jobUrl: string | null;
  keyRequirements: string[];
  jdSnapshot: string | null;
  status: ApplicationStatusType;
  appliedAt: Date;
  followUpAt: Date | null;
  interviewAt: Date | null;
  recruiterName: string | null;
  recruiterContact: string | null;
  createdAt: Date;
  updatedAt: Date;
  matchScore: number | null;
  activities?: ActivityLogItem[];
}

interface DistanceRow {
  id: string;
  distance: number | null;
}

async function fetchMatchScoreMap(userId: string, applicationId?: string): Promise<Map<string, number | null>> {
  const rows = applicationId
    ? await db.$queryRaw<DistanceRow[]>`
        SELECT a.id,
               CASE
                 WHEN u.cv_embedding IS NOT NULL AND a.jd_embedding IS NOT NULL
                 THEN (a.jd_embedding <=> u.cv_embedding)::float8
                 ELSE NULL
               END AS distance
        FROM applications a
        INNER JOIN users u ON u.id = a.user_id
        WHERE a.user_id = ${userId}
          AND a.id = ${applicationId}
          AND a.deleted_at IS NULL
      `
    : await db.$queryRaw<DistanceRow[]>`
        SELECT a.id,
               CASE
                 WHEN u.cv_embedding IS NOT NULL AND a.jd_embedding IS NOT NULL
                 THEN (a.jd_embedding <=> u.cv_embedding)::float8
                 ELSE NULL
               END AS distance
        FROM applications a
        INNER JOIN users u ON u.id = a.user_id
        WHERE a.user_id = ${userId}
          AND a.deleted_at IS NULL
      `;

  const scoreMap = new Map<string, number | null>();
  for (const row of rows) {
    scoreMap.set(row.id, cosineDistanceToMatchScore(row.distance));
  }
  return scoreMap;
}

export const applicationsRepository = {
  async listByUser(
    userId: string,
    filter: { status?: ApplicationStatusType; q?: string }
  ): Promise<ApplicationRecord[]> {
    const [items, scoreMap] = await Promise.all([
      db.application.findMany({
        where: {
          userId,
          deletedAt: null,
          ...(filter.status ? { status: filter.status as ApplicationStatus } : {}),
          ...(filter.q
            ? {
                OR: [
                  { companyName: { contains: filter.q, mode: "insensitive" } },
                  { position: { contains: filter.q, mode: "insensitive" } },
                  { location: { contains: filter.q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: { appliedAt: "desc" },
      }),
      fetchMatchScoreMap(userId),
    ]);

    return items.map((item) => ({
      ...item,
      status: item.status as ApplicationStatusType,
      matchScore: scoreMap.get(item.id) ?? null,
    }));
  },

  async findByIdForUser(id: string, userId: string): Promise<ApplicationRecord | null> {
    const [item, scoreMap] = await Promise.all([
      db.application.findFirst({
        where: { id, userId, deletedAt: null },
        include: {
          activities: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              actionType: true,
              notes: true,
              createdAt: true,
            },
          },
        },
      }),
      fetchMatchScoreMap(userId, id),
    ]);

    if (!item) return null;

    return {
      ...item,
      status: item.status as ApplicationStatusType,
      matchScore: scoreMap.get(item.id) ?? null,
    };
  },

  async create(data: {
    userId: string;
    companyName: string;
    position: string;
    location: string | null;
    employmentType: string | null;
    salaryRange: string | null;
    jobSource: string | null;
    jobUrl: string | null;
    keyRequirements: string[];
    jdSnapshot: string | null;
    recruiterName: string | null;
    recruiterContact: string | null;
    appliedAt: Date;
    followUpAt: Date;
  }): Promise<ApplicationRecord> {
    const created = await db.application.create({
      data: {
        ...data,
        status: "APPLIED",
        activities: {
          create: {
            actionType: "APPLIED",
            notes: `Lamaran untuk posisi ${data.position} di ${data.companyName} dicatat.`,
          },
        },
      },
      include: {
        activities: {
          orderBy: { createdAt: "desc" },
          select: { id: true, actionType: true, notes: true, createdAt: true },
        },
      },
    });

    return {
      ...created,
      status: created.status as ApplicationStatusType,
      matchScore: null,
    };
  },

  async updateEmbedding(applicationId: string, vectorLiteral: string): Promise<void> {
    await db.$executeRaw`
      UPDATE applications
      SET jd_embedding = ${vectorLiteral}::vector
      WHERE id = ${applicationId}
    `;
  },

  async updateFields(
    id: string,
    data: {
      companyName?: string;
      position?: string;
      location?: string | null;
      employmentType?: string | null;
      salaryRange?: string | null;
      jobSource?: string | null;
      jobUrl?: string | null;
      keyRequirements?: string[];
      jdSnapshot?: string | null;
      recruiterName?: string | null;
      recruiterContact?: string | null;
      followUpAt?: Date | null;
      interviewAt?: Date | null;
    }
  ): Promise<ApplicationRecord> {
    const updated = await db.application.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      status: updated.status as ApplicationStatusType,
      matchScore: null,
    };
  },

  async updateStatusWithLog(params: {
    id: string;
    status: ApplicationStatusType;
    interviewAt?: Date | null;
    notes?: string | null;
  }): Promise<ApplicationRecord> {
    const [updated] = await db.$transaction([
      db.application.update({
        where: { id: params.id },
        data: {
          status: params.status as ApplicationStatus,
          ...(params.interviewAt !== undefined ? { interviewAt: params.interviewAt } : {}),
        },
        include: {
          activities: {
            orderBy: { createdAt: "desc" },
            select: { id: true, actionType: true, notes: true, createdAt: true },
          },
        },
      }),
      db.activityLog.create({
        data: {
          applicationId: params.id,
          actionType: params.status,
          notes: params.notes ?? `Status lamaran diperbarui ke ${params.status}.`,
        },
      }),
    ]);

    return {
      ...updated,
      status: updated.status as ApplicationStatusType,
      matchScore: null,
    };
  },

  async softDelete(id: string): Promise<void> {
    await db.application.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async createActivityLog(applicationId: string, actionType: string, notes: string): Promise<void> {
    await db.activityLog.create({
      data: {
        applicationId,
        actionType,
        notes,
      },
    });
  },
};
