import type { ApplicationStatusType } from "@/constants/application";
import type { ApplicationDto } from "@/features/shared/workspace-types";

export type KanbanFolderId =
  | "APPLIED"
  | "FOLLOW_UP_NEEDED"
  | "INTERVIEW_SCHEDULED"
  | "OFFERED"
  | "REJECTED_OR_GHOSTED";

export interface KanbanFolderDefinition {
  id: KanbanFolderId;
  title: string;
  subtitle: string;
  targetStatus: ApplicationStatusType;
}

export const KANBAN_FOLDERS: readonly KanbanFolderDefinition[] = [
  {
    id: "APPLIED",
    title: "Applied",
    subtitle: "Tahap terkirim",
    targetStatus: "APPLIED",
  },
  {
    id: "FOLLOW_UP_NEEDED",
    title: "Follow-Up Needed",
    subtitle: "Perlu tindak lanjut",
    targetStatus: "FOLLOW_UP_NEEDED",
  },
  {
    id: "INTERVIEW_SCHEDULED",
    title: "Interview",
    subtitle: "Tahap berjalan",
    targetStatus: "INTERVIEW_SCHEDULED",
  },
  {
    id: "OFFERED",
    title: "Offered",
    subtitle: "Tahap penawaran",
    targetStatus: "OFFERED",
  },
  {
    id: "REJECTED_OR_GHOSTED",
    title: "Rejected / Ghosted",
    subtitle: "Terarsip rapi",
    targetStatus: "REJECTED",
  },
] as const;

export function mapStatusToKanbanFolder(status: ApplicationStatusType): KanbanFolderId {
  if (status === "REJECTED" || status === "GHOSTED") {
    return "REJECTED_OR_GHOSTED";
  }
  return status;
}

export function filterApplicationsForFolder(
  apps: readonly ApplicationDto[],
  folderId: KanbanFolderId,
  searchQuery: string
): ApplicationDto[] {
  const q = searchQuery.trim().toLowerCase();
  return apps.filter((app) => {
    if (mapStatusToKanbanFolder(app.status) !== folderId) return false;
    if (q.length === 0) return true;
    return (
      app.companyName.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      (app.location ?? "").toLowerCase().includes(q)
    );
  });
}
