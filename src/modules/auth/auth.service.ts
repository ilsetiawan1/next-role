import { randomUUID } from "node:crypto";
import { AppError } from "@/middlewares/error-handler";
import { hashPassword, verifyPassword } from "@/utils/password";
import { authRepository, type AuthUserRecord } from "./auth.repository";
import type { CredentialsLoginInput, RegisterInput } from "./auth.schema";

export interface AuthRepositoryPort {
  findUserByEmail: typeof authRepository.findUserByEmail;
  createUser: typeof authRepository.createUser;
  upsertOAuthUser: typeof authRepository.upsertOAuthUser;
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
    isGuest: user.email.endsWith("@guest.nextrole.local"),
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
      const shortId = randomUUID().slice(0, 8);
      const user = await repo.createUser({
        name: "Guest Explorer",
        email: `guest-${shortId}@guest.nextrole.local`,
      });
      return toSafeUser(user);
    },
  };
}

export const authService = createAuthService();
