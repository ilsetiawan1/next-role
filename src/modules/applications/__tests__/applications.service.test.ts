import { describe, expect, it } from "bun:test";
import { AppError } from "@/middlewares/error-handler";
import { cosineDistanceToMatchScore, toVectorLiteral } from "@/utils/vector";
import {
  createApplicationsService,
  type ApplicationsRepositoryPort,
} from "../applications.service";
import type { ApplicationRecord } from "../applications.repository";

function createInMemoryApplicationsRepo(): ApplicationsRepositoryPort {
  const store = new Map<string, ApplicationRecord & { deletedAt: Date | null; embedding?: string }>();

  return {
    async listByUser(userId, filter) {
      return [...store.values()].filter(
        (a) => a.userId === userId && !a.deletedAt && (!filter.status || a.status === filter.status)
      );
    },
    async findByIdForUser(id, userId) {
      const item = store.get(id);
      if (!item || item.userId !== userId || item.deletedAt) return null;
      return item;
    },
    async create(data) {
      const now = new Date();
      const rec: ApplicationRecord & { deletedAt: Date | null } = {
        id: `app-${store.size + 1}`,
        ...data,
        status: "APPLIED",
        interviewAt: null,
        createdAt: now,
        updatedAt: now,
        matchScore: 84,
        activities: [
          {
            id: "act-1",
            actionType: "APPLIED",
            notes: "Lamaran dicatat.",
            createdAt: now,
          },
        ],
        deletedAt: null,
      };
      store.set(rec.id, rec);
      return rec;
    },
    async updateEmbedding(id, vectorLiteral) {
      const item = store.get(id);
      if (item) item.embedding = vectorLiteral;
    },
    async updateFields(id, data) {
      const item = store.get(id)!;
      Object.assign(item, data);
      return item;
    },
    async updateStatusWithLog(params) {
      const item = store.get(params.id)!;
      item.status = params.status;
      if (params.interviewAt !== undefined) item.interviewAt = params.interviewAt;
      item.activities = [
        ...(item.activities ?? []),
        {
          id: `act-${(item.activities?.length ?? 0) + 1}`,
          actionType: params.status,
          notes: params.notes ?? null,
          createdAt: new Date(),
        },
      ];
      return item;
    },
    async softDelete(id) {
      const item = store.get(id);
      if (item) item.deletedAt = new Date();
    },
    async createActivityLog(id, actionType, notes) {
      const item = store.get(id);
      if (item) {
        item.activities = [
          ...(item.activities ?? []),
          { id: `act-${(item.activities?.length ?? 0) + 1}`, actionType, notes, createdAt: new Date() },
        ];
      }
    },
  };
}

describe("applicationsService & vector utils", () => {
  it("converts pgvector cosine distance to 0-100 matchScore", () => {
    expect(cosineDistanceToMatchScore(0)).toBe(100);
    expect(cosineDistanceToMatchScore(0.15)).toBe(85);
    expect(cosineDistanceToMatchScore(1.2)).toBe(0);
    expect(cosineDistanceToMatchScore(null)).toBeNull();
  });

  it("validates 768-dimension vector literal", () => {
    const vec = Array.from({ length: 768 }, () => 0.5);
    expect(toVectorLiteral(vec).startsWith("[0.5,")).toBe(true);
    expect(() => toVectorLiteral([0.1, 0.2])).toThrow();
  });

  it("creates application, enforces ownership, updates status with log, and soft-deletes", async () => {
    const service = createApplicationsService({
      repo: createInMemoryApplicationsRepo(),
      generateEmbedding: async () => Array.from({ length: 768 }, () => 0.1),
    });

    const created = await service.createApplication("user-a", {
      companyName: "PT Maju Bersama",
      position: "Fullstack Engineer",
      keyRequirements: ["TypeScript", "PostgreSQL"],
      jdSnapshot: "Membangun aplikasi web fullstack berbasis Next.js dan PostgreSQL.",
    });

    expect(created.status).toBe("APPLIED");
    expect(created.matchScore).toBe(84);

    // User lain tidak boleh mengakses lamaran milik user-a
    await expect(service.getApplicationById("user-b", created.id)).rejects.toBeInstanceOf(AppError);

    // Update status -> mencatat ActivityLog
    const moved = await service.updateStatus("user-a", created.id, {
      status: "INTERVIEW_SCHEDULED",
      notes: "Interview user jam 10:00 WIB",
    });
    expect(moved.status).toBe("INTERVIEW_SCHEDULED");
    expect(moved.activities?.length).toBe(2);

    // Soft-delete -> tidak lagi muncul di list
    await service.deleteApplication("user-a", created.id);
    const list = await service.listApplications("user-a", {});
    expect(list.length).toBe(0);
  });

  it("re-embeds all user applications in a single batch call via embedMany", async () => {
    let batchCalls = 0;
    let batchSize = 0;
    const updatedIds: string[] = [];
    const baseRepo = createInMemoryApplicationsRepo();
    const repo: ApplicationsRepositoryPort = {
      ...baseRepo,
      async updateEmbedding(id, vec) {
        updatedIds.push(id);
        await baseRepo.updateEmbedding(id, vec);
      },
    };

    const service = createApplicationsService({
      repo,
      generateEmbedding: async () => Array.from({ length: 768 }, () => 0.1),
      generateEmbeddingsBatch: async (texts) => {
        batchCalls += 1;
        batchSize = texts.length;
        return texts.map(() => Array.from({ length: 768 }, () => 0.25));
      },
    });

    await service.createApplication("user-batch", {
      companyName: "Tokopedia",
      position: "Frontend Engineer",
      keyRequirements: ["React", "TypeScript"],
      jdSnapshot: "Membangun antarmuka e-commerce dengan React dan Next.js.",
    });
    await service.createApplication("user-batch", {
      companyName: "GoTo",
      position: "Fullstack Engineer",
      keyRequirements: ["Node.js", "PostgreSQL"],
      jdSnapshot: "Mengembangkan layanan backend Node.js dan database PostgreSQL.",
    });

    updatedIds.length = 0;
    await service.reembedUserApplications("user-batch");
    expect(batchCalls).toBe(1);
    expect(batchSize).toBe(2);
    expect(updatedIds.length).toBe(2);
  });
});
