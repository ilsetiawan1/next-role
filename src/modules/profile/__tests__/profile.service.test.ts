import { describe, expect, it } from "bun:test";
import { MAX_CV_FILE_SIZE_BYTES } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import {
  createProfileService,
  type ProfileRepositoryPort,
  type R2StoragePort,
} from "../profile.service";
import type { UserProfileRecord } from "../profile.repository";

describe("profileService", () => {
  it("rejects non-PDF files and oversized PDFs", async () => {
    const service = createProfileService({
      repo: {
        async findByUserId() {
          return null;
        },
        async updateCvData() {
          throw new Error("should not call");
        },
        async updateCvEmbedding() {},
        async clearCv() {},
      },
    });

    await expect(
      service.uploadCv("u1", {
        name: "cv.txt",
        type: "text/plain",
        size: 100,
        buffer: Buffer.from("hello world"),
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      service.uploadCv("u1", {
        name: "cv.pdf",
        type: "application/pdf",
        size: MAX_CV_FILE_SIZE_BYTES + 1,
        buffer: Buffer.from("%PDF-1.4"),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("uploads PDF to R2, skips re-embedding when cvHash unchanged, and issues 5-min presigned URL", async () => {
    let embedCalls = 0;
    const deletedKeys: string[] = [];
    const uploadedKeys: string[] = [];

    let user: UserProfileRecord = {
      id: "u1",
      name: "Andi",
      email: "andi@example.com",
      image: null,
      dailyAiClipsCount: 2,
      lastClipResetAt: new Date("2026-11-24T01:00:00Z"),
      cvFileKey: "cvs/u1/old-cv.pdf",
      cvFileName: "old-cv.pdf",
      cvHash: null,
      cvUpdatedAt: null,
    };

    const repo: ProfileRepositoryPort = {
      async findByUserId() {
        return user;
      },
      async updateCvData(_id, data) {
        user = { ...user, ...data };
        return user;
      },
      async updateCvEmbedding() {},
      async clearCv() {
        user = { ...user, cvFileKey: null, cvFileName: null, cvHash: null, cvUpdatedAt: null };
      },
    };

    const storage: R2StoragePort = {
      async putObject(key) {
        uploadedKeys.push(key);
      },
      async deleteObject(key) {
        deletedKeys.push(key);
      },
      async getPresignedDownloadUrl(key, expiresIn) {
        return `https://r2.signed.local/${key}?expires=${expiresIn}`;
      },
    };

    const service = createProfileService({
      repo,
      storage,
      extractPdfText: async () => "Senior Frontend Engineer React Next.js TypeScript 5 tahun pengalaman",
      generateEmbedding: async () => {
        embedCalls += 1;
        return Array.from({ length: 768 }, () => 0.25);
      },
      now: () => new Date("2026-11-24T10:00:00Z"),
    });

    const first = await service.uploadCv("u1", {
      name: "CV Andi 2026.pdf",
      type: "application/pdf",
      size: 1024,
      buffer: Buffer.from("%PDF-1.7 dummy pdf bytes"),
    });
    expect(first.reembedded).toBe(true);
    expect(embedCalls).toBe(1);
    expect(deletedKeys).toContain("cvs/u1/old-cv.pdf");
    expect(uploadedKeys.length).toBe(1);

    // Upload ulang teks CV identik -> skip embedding
    const second = await service.uploadCv("u1", {
      name: "CV Andi 2026.pdf",
      type: "application/pdf",
      size: 1024,
      buffer: Buffer.from("%PDF-1.7 dummy pdf bytes"),
    });
    expect(second.reembedded).toBe(false);
    expect(embedCalls).toBe(1);

    // Presigned URL berumur 300 detik (5 menit)
    const preview = await service.getCvPreviewUrl("u1");
    expect(preview.expiresInSeconds).toBe(300);
    expect(preview.url.includes("expires=300")).toBe(true);

    // Delete CV -> bersihkan R2 dan DB
    await service.deleteCv("u1");
    expect(user.cvFileKey).toBeNull();
  });
});
