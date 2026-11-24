import { redirect } from "next/navigation";
import { ProfileView } from "@/features/profile";
import type { ProfileDto } from "@/features/shared/workspace-types";
import { auth } from "@/modules/auth/auth.config";
import { applicationsService } from "@/modules/applications/applications.service";
import { profileService } from "@/modules/profile/profile.service";

export const instant = false;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [profileRecord, applications] = await Promise.all([
    profileService.getProfile(session.user.id),
    applicationsService.listApplications(session.user.id, {}),
  ]);

  const initialProfile: ProfileDto = {
    ...profileRecord,
    cv: {
      ...profileRecord.cv,
      updatedAt: profileRecord.cv.updatedAt ? profileRecord.cv.updatedAt.toISOString() : null,
    },
  };

  const totalApplied = applications.length;
  const interviews = applications.filter((a) => a.status === "INTERVIEW_SCHEDULED").length;
  const offers = applications.filter((a) => a.status === "OFFERED").length;
  const responded = applications.filter(
    (a) => a.status === "INTERVIEW_SCHEDULED" || a.status === "OFFERED" || a.status === "REJECTED"
  ).length;
  const responseRate = totalApplied > 0 ? Math.round((responded / totalApplied) * 100) : 0;

  return (
    <ProfileView
      initialProfile={initialProfile}
      isGuest={Boolean(session.user.isGuest)}
      stats={{ totalApplied, interviews, offers, responseRate }}
    />
  );
}
