import { describe, expect, it } from "bun:test";
import { AppError } from "@/middlewares/error-handler";
import { hashPassword, verifyPassword } from "@/utils/password";
import { createAuthService, type AuthRepositoryPort } from "../auth.service";
import type { AuthUserRecord } from "../auth.repository";

function createInMemoryAuthRepo(): AuthRepositoryPort {
  const users = new Map<string, AuthUserRecord>();
  return {
    async findUserByEmail(email) {
      return users.get(email) ?? null;
    },
    async createUser(data) {
      const record: AuthUserRecord = {
        id: `user-${users.size + 1}`,
        name: data.name,
        email: data.email,
        image: data.image ?? null,
        passwordHash: data.passwordHash ?? null,
      };
      users.set(record.email, record);
      return record;
    },
    async upsertOAuthUser(data) {
      const existing = users.get(data.email);
      const record: AuthUserRecord = {
        id: existing?.id ?? `oauth-${users.size + 1}`,
        name: data.name ?? existing?.name ?? null,
        email: data.email,
        image: data.image ?? existing?.image ?? null,
        passwordHash: existing?.passwordHash ?? null,
      };
      users.set(record.email, record);
      return record;
    },
  };
}

describe("authService", () => {
  it("hashes and verifies password securely with scrypt", () => {
    const hash = hashPassword("SecretPass123!");
    expect(verifyPassword("SecretPass123!", hash)).toBe(true);
    expect(verifyPassword("WrongPass", hash)).toBe(false);
  });

  it("registers a new user and rejects duplicate email", async () => {
    const service = createAuthService(createInMemoryAuthRepo());
    const user = await service.register({
      name: "Budi",
      email: "budi@example.com",
      password: "Password123!",
    });

    expect(user.email).toBe("budi@example.com");
    expect(user.isGuest).toBe(false);

    await expect(
      service.register({
        name: "Budi 2",
        email: "budi@example.com",
        password: "Password123!",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("authenticates valid credentials and rejects wrong password", async () => {
    const service = createAuthService(createInMemoryAuthRepo());
    await service.register({
      name: "Siti",
      email: "siti@example.com",
      password: "Password123!",
    });

    const ok = await service.authenticateCredentials({
      email: "siti@example.com",
      password: "Password123!",
    });
    expect(ok?.email).toBe("siti@example.com");

    const bad = await service.authenticateCredentials({
      email: "siti@example.com",
      password: "WrongPassword",
    });
    expect(bad).toBeNull();
  });

  it("provisions an isolated guest demo user", async () => {
    const events: { cleanupCutoff?: Date; seededUserId?: string } = {};
    const baseRepo = createInMemoryAuthRepo();
    const service = createAuthService({
      ...baseRepo,
      async deleteExpiredGuestUsers(cutoff) {
        events.cleanupCutoff = cutoff;
      },
      async seedGuestWorkspace(userId) {
        events.seededUserId = userId;
      },
    });

    const guest = await service.provisionGuestUser();
    expect(guest.name).toBe("Guest Demo");
    expect(guest.isGuest).toBe(true);
    expect(guest.email.endsWith("@guest.nextrole.local")).toBe(true);
    expect(events.cleanupCutoff).toBeInstanceOf(Date);
    expect(events.seededUserId).toBe(guest.id);
  });
});
