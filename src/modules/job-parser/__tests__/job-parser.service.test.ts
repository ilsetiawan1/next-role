import { describe, expect, it } from "bun:test";
import { AppError } from "@/middlewares/error-handler";
import {
  createJobParserService,
  stripHtmlToText,
  validateSafeJobUrl,
  type JobParserRepositoryPort,
} from "../job-parser.service";
import type { ParsedJobPayload } from "../job-parser.schema";

const SAMPLE_PARSED: ParsedJobPayload = {
  companyName: "PT Teknologi Nusantara",
  position: "Frontend Engineer",
  location: "Jakarta (Hybrid)",
  employmentType: "Full-time",
  salaryRange: "Rp 15.000.000 - Rp 20.000.000",
  jobSource: "LinkedIn",
  keyRequirements: ["Next.js", "TypeScript", "Tailwind CSS"],
  jdSnapshot: "Membangun antarmuka web modern menggunakan Next.js dan TypeScript.",
};

describe("jobParserService", () => {
  it("strips HTML tags and script blocks without RegEx", () => {
    const html = "<html><head><script>alert(1)</script><style>body{}</style></head><body><h1>Frontend</h1><p>Next.js &amp; TS</p></body></html>";
    expect(stripHtmlToText(html)).toBe("Frontend Next.js &amp; TS");
  });

  it("blocks localhost/private URLs and accepts https URLs", () => {
    expect(() => validateSafeJobUrl("http://localhost:3000/secret")).toThrow(AppError);
    expect(() => validateSafeJobUrl("http://127.0.0.1/admin")).toThrow(AppError);
    expect(validateSafeJobUrl("https://careers.example.com/jobs/1").hostname).toBe(
      "careers.example.com"
    );
  });

  it("returns cached result with 0 AI calls and 0 quota deducted on cache hit", async () => {
    let aiCalls = 0;
    let quotaUpdated = false;
    const cache = new Map<string, ParsedJobPayload>();

    const repo: JobParserRepositoryPort = {
      async findCacheByHash(hash) {
        const hit = cache.get(hash);
        if (!hit) return null;
        return {
          id: "c1",
          contentHash: hash,
          inputType: "RAW_TEXT",
          parsedPayload: hit,
          modelVersion: "gemini-3.5-flash-lite",
        };
      },
      async saveCache(data) {
        cache.set(data.contentHash, data.parsedPayload as unknown as ParsedJobPayload);
      },
      async getUserQuota() {
        return { dailyAiClipsCount: 2, lastClipResetAt: new Date("2026-11-24T01:00:00Z") };
      },
      async updateUserQuota() {
        quotaUpdated = true;
      },
    };

    const service = createJobParserService({
      repo,
      now: () => new Date("2026-11-24T08:00:00Z"),
      aiExtract: async () => {
        aiCalls += 1;
        return SAMPLE_PARSED;
      },
    });

    // Pertama kali -> cache miss
    const first = await service.extract("u1", {
      inputType: "RAW_TEXT",
      content: "Lowongan Frontend Engineer PT Teknologi Nusantara Jakarta",
    });
    expect(first.meta.cached).toBe(false);
    expect(first.meta.quotaUsed).toBe(3);
    expect(aiCalls).toBe(1);
    expect(quotaUpdated).toBe(true);

    // Kedua kali dengan input sama -> cache hit
    quotaUpdated = false;
    const second = await service.extract("u1", {
      inputType: "RAW_TEXT",
      content: "  Lowongan Frontend Engineer   PT Teknologi Nusantara Jakarta ",
    });
    expect(second.meta.cached).toBe(true);
    expect(second.meta.quotaUsed).toBe(2);
    expect(aiCalls).toBe(1);
    expect(quotaUpdated).toBe(false);
  });

  it("rejects with 429 when daily quota of 5 clips is reached", async () => {
    const repo: JobParserRepositoryPort = {
      async findCacheByHash() {
        return null;
      },
      async saveCache() {},
      async getUserQuota() {
        return { dailyAiClipsCount: 5, lastClipResetAt: new Date("2026-11-24T01:00:00Z") };
      },
      async updateUserQuota() {},
    };

    const service = createJobParserService({
      repo,
      now: () => new Date("2026-11-24T08:00:00Z"),
      aiExtract: async () => SAMPLE_PARSED,
    });

    try {
      await service.extract("u1", {
        inputType: "RAW_TEXT",
        content: "Lowongan Backend Engineer Go & PostgreSQL di Bandung",
      });
      expect.unreachable("Seharusnya melempar 429 RATE_LIMITED");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(429);
    }
  });

  it("extracts POSTER_IMAGE and enforces 2-clip quota for Guest Demo accounts", async () => {
    let receivedImageMime: string | undefined;
    const repo: JobParserRepositoryPort = {
      async findCacheByHash() {
        return null;
      },
      async saveCache() {},
      async getUserQuota() {
        return {
          email: "guest-abc12345@guest.nextrole.local",
          dailyAiClipsCount: 1,
          lastClipResetAt: new Date("2026-11-24T01:00:00Z"),
        };
      },
      async updateUserQuota() {},
    };

    const service = createJobParserService({
      repo,
      now: () => new Date("2026-11-24T08:00:00Z"),
      aiExtract: async (input) => {
        receivedImageMime = input.image?.mimeType;
        return SAMPLE_PARSED;
      },
    });

    const ok = await service.extract("guest-1", {
      inputType: "POSTER_IMAGE",
      imageBase64: Buffer.from("fake-png-bytes-for-unit-test").toString("base64"),
      mimeType: "image/png",
    });
    expect(receivedImageMime).toBe("image/png");
    expect(ok.meta.quotaUsed).toBe(2);
    expect(ok.meta.quotaLimit).toBe(2);

    // Guest dengan 2 klip terpakai harus ditolak 429
    const exhaustedService = createJobParserService({
      repo: {
        ...repo,
        async getUserQuota() {
          return {
            email: "guest-abc12345@guest.nextrole.local",
            dailyAiClipsCount: 2,
            lastClipResetAt: new Date("2026-11-24T01:00:00Z"),
          };
        },
      },
      now: () => new Date("2026-11-24T08:00:00Z"),
      aiExtract: async () => SAMPLE_PARSED,
    });

    try {
      await exhaustedService.extract("guest-1", {
        inputType: "RAW_TEXT",
        content: "Lowongan QA Engineer Automation Playwright di Jakarta",
      });
      expect.unreachable("Guest Demo harus dibatasi 2 klip");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(429);
    }
  });
});
