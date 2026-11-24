import { generateEmbedding768 } from "@/config/ai";
import { ERROR_MESSAGES } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { calculateFollowUpDate } from "@/utils/date";
import { toVectorLiteral } from "@/utils/vector";
import { applicationsRepository, type ApplicationRecord } from "./applications.repository";
import type {
  CreateApplicationInput,
  ListApplicationsQuery,
  UpdateApplicationInput,
  UpdateApplicationStatusInput,
} from "./applications.schema";

export interface ApplicationsRepositoryPort {
  listByUser: typeof applicationsRepository.listByUser;
  findByIdForUser: typeof applicationsRepository.findByIdForUser;
  create: typeof applicationsRepository.create;
  updateEmbedding: typeof applicationsRepository.updateEmbedding;
  updateFields: typeof applicationsRepository.updateFields;
  updateStatusWithLog: typeof applicationsRepository.updateStatusWithLog;
  softDelete: typeof applicationsRepository.softDelete;
  createActivityLog: typeof applicationsRepository.createActivityLog;
}

export type EmbeddingGenerator = (text: string) => Promise<number[]>;

export function createApplicationsService(deps?: {
  repo?: ApplicationsRepositoryPort;
  generateEmbedding?: EmbeddingGenerator;
}) {
  const repo = deps?.repo ?? applicationsRepository;
  const generateEmbedding = deps?.generateEmbedding ?? generateEmbedding768;

  return {
    async listApplications(
      userId: string,
      query: ListApplicationsQuery
    ): Promise<ApplicationRecord[]> {
      return repo.listByUser(userId, query);
    },

    async getApplicationById(userId: string, id: string): Promise<ApplicationRecord> {
      const app = await repo.findByIdForUser(id, userId);
      if (!app) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }
      return app;
    },

    async createApplication(
      userId: string,
      input: CreateApplicationInput
    ): Promise<ApplicationRecord> {
      const appliedAt = input.appliedAt ? new Date(input.appliedAt) : new Date();
      const followUpAt = calculateFollowUpDate(appliedAt);

      const created = await repo.create({
        userId,
        companyName: input.companyName,
        position: input.position,
        location: input.location ?? null,
        employmentType: input.employmentType ?? null,
        salaryRange: input.salaryRange ?? null,
        jobSource: input.jobSource ?? null,
        jobUrl: input.jobUrl ?? null,
        keyRequirements: input.keyRequirements,
        jdSnapshot: input.jdSnapshot ?? null,
        recruiterName: input.recruiterName ?? null,
        recruiterContact: input.recruiterContact ?? null,
        appliedAt,
        followUpAt,
      });

      // Generate 1x vektor embedding JD jika jdSnapshot tersedia (non-fatal bila layanan AI gangguan)
      const embeddingSource = [
        input.position,
        input.companyName,
        input.keyRequirements.join(", "),
        input.jdSnapshot ?? "",
      ]
        .filter((s) => s.trim().length > 0)
        .join("\n");

      if (embeddingSource.length >= 20) {
        try {
          const vector = await generateEmbedding(embeddingSource);
          await repo.updateEmbedding(created.id, toVectorLiteral(vector));
        } catch (error) {
          console.error("[APPLICATION_EMBEDDING_WARNING]", error);
        }
      }

      const refreshed = await repo.findByIdForUser(created.id, userId);
      return refreshed ?? created;
    },

    async updateApplication(
      userId: string,
      id: string,
      input: UpdateApplicationInput
    ): Promise<ApplicationRecord> {
      const existing = await repo.findByIdForUser(id, userId);
      if (!existing) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }

      await repo.updateFields(id, {
        ...input,
        followUpAt:
          input.followUpAt === undefined
            ? undefined
            : input.followUpAt === null
              ? null
              : new Date(input.followUpAt),
        interviewAt:
          input.interviewAt === undefined
            ? undefined
            : input.interviewAt === null
              ? null
              : new Date(input.interviewAt),
      });

      if (input.jdSnapshot && input.jdSnapshot !== existing.jdSnapshot) {
        try {
          const vector = await generateEmbedding(input.jdSnapshot);
          await repo.updateEmbedding(id, toVectorLiteral(vector));
        } catch (error) {
          console.error("[APPLICATION_REEMBED_WARNING]", error);
        }
      }

      const refreshed = await repo.findByIdForUser(id, userId);
      if (!refreshed) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }
      return refreshed;
    },

    async updateStatus(
      userId: string,
      id: string,
      input: UpdateApplicationStatusInput
    ): Promise<ApplicationRecord> {
      const existing = await repo.findByIdForUser(id, userId);
      if (!existing) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }

      await repo.updateStatusWithLog({
        id,
        status: input.status,
        interviewAt:
          input.interviewAt === undefined
            ? undefined
            : input.interviewAt === null
              ? null
              : new Date(input.interviewAt),
        notes: input.notes,
      });

      const refreshed = await repo.findByIdForUser(id, userId);
      if (!refreshed) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }
      return refreshed;
    },

    async deleteApplication(userId: string, id: string): Promise<void> {
      const existing = await repo.findByIdForUser(id, userId);
      if (!existing) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }
      await repo.softDelete(id);
    },

    async recordFollowUpDraft(userId: string, id: string, language: "id" | "en"): Promise<void> {
      const existing = await repo.findByIdForUser(id, userId);
      if (!existing) {
        throw new AppError(404, ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
      }
      const label = language === "id" ? "Bahasa Indonesia" : "English";
      await repo.createActivityLog(id, "FOLLOW_UP_DRAFTED", `Draf pesan follow-up (${label}) dibuat.`);
    },
  };
}

export const applicationsService = createApplicationsService();
