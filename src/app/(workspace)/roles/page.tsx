import { redirect } from "next/navigation";
import { connection } from "next/server";
import { KanbanWorkspace } from "@/features/kanban";
import type { ApplicationDto } from "@/features/shared/workspace-types";
import { auth } from "@/modules/auth/auth.config";
import { applicationsService } from "@/modules/applications/applications.service";

export const instant = false;

export default async function RolesPage() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const records = await applicationsService.listApplications(session.user.id, {});
  const initialApplications: ApplicationDto[] = records.map((r) => ({
    ...r,
    appliedAt: r.appliedAt.toISOString(),
    followUpAt: r.followUpAt ? r.followUpAt.toISOString() : null,
    interviewAt: r.interviewAt ? r.interviewAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    activities: r.activities?.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
  }));

  return <KanbanWorkspace initialApplications={initialApplications} />;
}
