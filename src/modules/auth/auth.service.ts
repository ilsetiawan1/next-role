import { randomUUID } from "node:crypto";
import { GUEST_EMAIL_DOMAIN, isGuestEmail } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { hashPassword, verifyPassword } from "@/utils/password";
import { authRepository, type AuthUserRecord } from "./auth.repository";
import type { CredentialsLoginInput, RegisterInput } from "./auth.schema";

export interface AuthRepositoryPort {
  findUserByEmail: typeof authRepository.findUserByEmail;
  createUser: typeof authRepository.createUser;
  upsertOAuthUser: typeof authRepository.upsertOAuthUser;
  deleteExpiredGuestUsers?: typeof authRepository.deleteExpiredGuestUsers;
  seedGuestWorkspace?: typeof authRepository.seedGuestWorkspace;
}

export interface SafeAuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isGuest: boolean;
}

function toSafeUser(user: AuthUserRecord): SafeAuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    isGuest: isGuestEmail(user.email),
  };
}

export function createAuthService(repo: AuthRepositoryPort = authRepository) {
  return {
    async register(input: RegisterInput): Promise<SafeAuthUser> {
      const existing = await repo.findUserByEmail(input.email);
      if (existing) {
        throw new AppError(409, "Email sudah terdaftar. Silakan masuk.", "EMAIL_ALREADY_EXISTS");
      }

      const passwordHash = hashPassword(input.password);
      const user = await repo.createUser({
        name: input.name,
        email: input.email,
        passwordHash,
      });

      return toSafeUser(user);
    },

    async authenticateCredentials(input: CredentialsLoginInput): Promise<SafeAuthUser | null> {
      const user = await repo.findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        return null;
      }

      const valid = verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        return null;
      }

      return toSafeUser(user);
    },

    async syncOAuthUser(params: {
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
    }): Promise<SafeAuthUser> {
      const user = await repo.upsertOAuthUser(params);
      return toSafeUser(user);
    },

    async provisionGuestUser(): Promise<SafeAuthUser> {
      // Bersihkan akun guest berusia > 24 jam secara best-effort agar DB Neon tetap ramping
      if (repo.deleteExpiredGuestUsers) {
        try {
          const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
          await repo.deleteExpiredGuestUsers(cutoff);
        } catch (error) {
          console.error("[GUEST_CLEANUP_WARNING]", error);
        }
      }

      const shortId = randomUUID().slice(0, 8);
      const user = await repo.createUser({
        name: "Ilham Setiawan (Demo)",
        email: `guest-${shortId}${GUEST_EMAIL_DOMAIN}`,
      });

      if (repo.seedGuestWorkspace) {
        try {
          await repo.seedGuestWorkspace(user.id);
        } catch (error) {
          console.error("[GUEST_SEED_WARNING]", error);
        }
      }

      return toSafeUser(user);
    },
  };
}

export const authService = createAuthService();
