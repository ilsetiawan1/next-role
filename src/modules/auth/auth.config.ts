import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { credentialsLoginSchema } from "./auth.schema";
import { authService } from "./auth.service";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isGuest: boolean;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        guest: { label: "Guest Mode", type: "text" },
      },
      async authorize(rawCredentials) {
        if (rawCredentials?.guest === "true") {
          const guestUser = await authService.provisionGuestUser();
          return {
            id: guestUser.id,
            name: guestUser.name,
            email: guestUser.email,
            image: guestUser.image,
          };
        }

        const parsed = credentialsLoginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await authService.authenticateCredentials(parsed.data);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const synced = await authService.syncOAuthUser({
          email: user.email.toLowerCase(),
          name: user.name,
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
        });
        user.id = synced.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
        token.isGuest = Boolean(user.email?.endsWith("@guest.nextrole.local"));
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.isGuest = Boolean(token.isGuest);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
