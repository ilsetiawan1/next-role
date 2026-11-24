import { ERROR_MESSAGES } from "@/constants/application";
import { AppError } from "@/middlewares/error-handler";
import { auth } from "@/modules/auth/auth.config";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string | null;
  isGuest: boolean;
}

/**
 * Memastikan request memiliki sesi Auth.js yang valid.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    isGuest: Boolean(session.user.isGuest),
  };
}
