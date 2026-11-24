import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getClipQuotaLimitForEmail } from "@/constants/application";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { auth } from "@/modules/auth/auth.config";
import { profileService } from "@/modules/profile/profile.service";

export const instant = false;

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    redirect("/login");
  }

  let quotaUsed = 0;
  let quotaLimit = getClipQuotaLimitForEmail(session.user.email);
  try {
    const profile = await profileService.getProfile(session.user.id);
    quotaUsed = profile.quota.used;
    quotaLimit = profile.quota.limit;
  } catch {
    quotaUsed = 0;
  }

  return (
    <WorkspaceShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email,
        isGuest: Boolean(session.user.isGuest),
      }}
      initialQuotaUsed={quotaUsed}
      quotaLimit={quotaLimit}
    >
      {children}
    </WorkspaceShell>
  );
}
