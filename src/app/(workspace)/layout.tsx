import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getClipQuotaLimitForEmail } from "@/constants/application";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { auth } from "@/modules/auth/auth.config";
import { profileService } from "@/modules/profile/profile.service";

export const instant = false;

export const metadata: Metadata = {
  title: "Workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  await connection();
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    redirect("/login");
  }

  let quotaUsed = 0;
  let quotaLimit = getClipQuotaLimitForEmail(session.user.email);
  let demoExpiresAt: string | null = null;
  let userImage: string | null = session.user.image ?? null;
  let initialNowMs = 0;
  try {
    const profile = await profileService.getProfile(session.user.id);
    quotaUsed = profile.quota.used;
    quotaLimit = profile.quota.limit;
    demoExpiresAt = profile.demoExpiresAt ? profile.demoExpiresAt.toISOString() : null;
    userImage = profile.image ?? userImage;
    initialNowMs = profile.serverNowMs;
  } catch {
    quotaUsed = 0;
  }

  return (
    <WorkspaceShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email,
        image: userImage,
        isGuest: Boolean(session.user.isGuest),
      }}
      initialQuotaUsed={quotaUsed}
      quotaLimit={quotaLimit}
      demoExpiresAt={demoExpiresAt}
      initialNowMs={initialNowMs}
    >
      {children}
    </WorkspaceShell>
  );
}
