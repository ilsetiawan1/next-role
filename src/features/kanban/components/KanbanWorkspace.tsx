"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpRight, GripVertical, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  ApplicationDetailPanel,
  updateApplicationStatusApi,
} from "@/features/application-detail";
import {
  formatShortDateId,
  getCompanyInitial,
  type ApplicationDto,
} from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import {
  filterApplicationsForFolder,
  KANBAN_FOLDERS,
  mapStatusToKanbanFolder,
  type KanbanFolderDefinition,
  type KanbanFolderId,
} from "../types/kanban.types";

function FolderDropzone({
  folder,
  count,
  active,
  onSelect,
}: {
  folder: KanbanFolderDefinition;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: folder.id });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onSelect}
      className={cn(
        "text-left rounded-2xl p-4 transition-all cursor-pointer border relative overflow-hidden",
        active
          ? "sky-hero-gradient text-white border-sky-400 shadow-lg shadow-sky-600/20"
          : "glass-surface text-slate-900 hover:border-sky-200",
        isOver && "ring-2 ring-[#D4FF47] scale-[1.02]"
      )}
    >
      <p className={cn("text-sm font-bold", active ? "text-white" : "text-slate-900")}>
        {folder.title}
      </p>
      <p className={cn("text-xs mt-0.5", active ? "text-sky-100" : "text-slate-500")}>
        {folder.subtitle}
      </p>

      <div className="mt-4">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
            active
              ? "bg-[#D4FF47] text-[#0C4A6E]"
              : "bg-sky-50 text-slate-700 border border-sky-100"
          )}
        >
          {count} lamaran
        </span>
      </div>
    </button>
  );
}

function DraggableApplicationCard({
  app,
  selected,
  onSelect,
}: {
  app: ApplicationDto;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "glass-surface rounded-2xl p-4 transition cursor-pointer border",
        selected ? "border-[#0284C7] ring-2 ring-sky-500/20" : "border-white/90 hover:border-sky-200",
        isDragging && "opacity-60 shadow-2xl z-30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center shrink-0">
            {getCompanyInitial(app.companyName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{app.companyName}</p>
            <p className="text-xs text-slate-500 truncate">
              {app.location ?? app.employmentType ?? "Lokasi belum diisi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#0284C7]">
            Detail
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
          <button
            type="button"
            aria-label={`Seret kartu ${app.companyName}`}
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-sky-50 hover:text-slate-700 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900 truncate">{app.position}</p>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-slate-700 truncate">
          {app.salaryRange ?? "Gaji belum dicantumkan"}
        </span>
        <span className="text-slate-500 shrink-0">
          Dilamar: {formatShortDateId(app.appliedAt)}
        </span>
      </div>
    </div>
  );
}

export function KanbanWorkspace({ initialApplications }: { initialApplications: ApplicationDto[] }) {
  const [applications, setApplications] = useState<ApplicationDto[]>(initialApplications);
  const [activeFolder, setActiveFolder] = useState<KanbanFolderId>("APPLIED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    function handleCreated(event: Event) {
      const created = (event as CustomEvent<ApplicationDto>).detail;
      if (!created?.id) return;
      setApplications((prev) => [created, ...prev]);
      setActiveFolder("APPLIED");
      setSelectedId(created.id);
    }
    window.addEventListener("nextrole:application-created", handleCreated);
    return () => window.removeEventListener("nextrole:application-created", handleCreated);
  }, []);

  const folderCounts = new Map<KanbanFolderId, number>();
  for (const folder of KANBAN_FOLDERS) {
    folderCounts.set(folder.id, 0);
  }
  for (const app of applications) {
    const f = mapStatusToKanbanFolder(app.status);
    folderCounts.set(f, (folderCounts.get(f) ?? 0) + 1);
  }

  const visibleApps = filterApplicationsForFolder(applications, activeFolder, searchQuery);
  const selectedApp =
    applications.find((a) => a.id === selectedId) ?? visibleApps[0] ?? null;

  async function handleDragEnd(event: DragEndEvent) {
    const appId = String(event.active.id);
    const targetFolderId = event.over?.id as KanbanFolderId | undefined;
    if (!targetFolderId) return;

    const targetFolder = KANBAN_FOLDERS.find((f) => f.id === targetFolderId);
    const currentApp = applications.find((a) => a.id === appId);
    if (!targetFolder || !currentApp) return;

    if (mapStatusToKanbanFolder(currentApp.status) === targetFolder.id) return;

    // Optimistic UI update
    const previousApps = applications;
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: targetFolder.targetStatus } : a))
    );
    setActiveFolder(targetFolder.id);
    setToastMsg(`Memindahkan ${currentApp.companyName} ke ${targetFolder.title}...`);

    try {
      const updated = await updateApplicationStatusApi(appId, targetFolder.targetStatus);
      setApplications((prev) => prev.map((a) => (a.id === appId ? updated : a)));
      setToastMsg(`${currentApp.companyName} dipindahkan ke ${targetFolder.title}.`);
      setTimeout(() => setToastMsg(null), 2600);
    } catch {
      setApplications(previousApps);
      setToastMsg("Gagal memindahkan kartu. Perubahan dikembalikan.");
      setTimeout(() => setToastMsg(null), 3200);
    }
  }

  function handleStatusUpdated(updated: ApplicationDto) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setActiveFolder(mapStatusToKanbanFolder(updated.status));
  }

  function handleDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
    setMobileDetailOpen(false);
  }

  const activeFolderMeta =
    KANBAN_FOLDERS.find((f) => f.id === activeFolder) ?? KANBAN_FOLDERS[0];

  return (
    <div className="space-y-6">
      {/* Header + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Papan Lamaran
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola {applications.length} lamaran aktif terstruktur dalam 5 tahapan pipeline. Seret
            kartu ke folder di bawah untuk memindahkan tahap.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Cari perusahaan atau posisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {toastMsg ? (
        <div className="rounded-2xl bg-sky-900 text-white px-4 py-2.5 text-xs font-medium inline-flex items-center shadow-md">
          {toastMsg}
        </div>
      ) : null}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* 5 Folder Dropzones (sesuai FigCraft Papan Lamaran) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {KANBAN_FOLDERS.map((folder) => (
            <FolderDropzone
              key={folder.id}
              folder={folder}
              count={folderCounts.get(folder.id) ?? 0}
              active={activeFolder === folder.id}
              onSelect={() => setActiveFolder(folder.id)}
            />
          ))}
        </div>

        {/* Split-View: Kartu Lamaran (Kiri) + Persistent Inspector (Kanan Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Daftar Lamaran: {activeFolderMeta.title} ({visibleApps.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih kartu di bawah untuk melihat arsip lengkap & kelola status
                </p>
              </div>
            </div>

            {visibleApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {visibleApps.map((app) => (
                  <DraggableApplicationCard
                    key={app.id}
                    app={app}
                    selected={selectedApp?.id === app.id}
                    onSelect={() => {
                      setSelectedId(app.id);
                      if (window.innerWidth < 1024) {
                        setMobileDetailOpen(true);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-surface rounded-3xl p-8 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  Belum ada lamaran di folder {activeFolderMeta.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Catat lamaran baru lewat Smart Job Clipper atau seret kartu dari folder lain ke
                  sini.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("nextrole:open-clipper"))}
              className="w-full h-12 rounded-2xl border border-dashed border-sky-300 bg-white/60 hover:bg-white text-xs font-semibold text-[#0284C7] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Lamaran Baru ke Folder Applied
            </button>
          </div>

          {/* Desktop Persistent Inspector */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <ApplicationDetailPanel
              application={selectedApp}
              onStatusUpdated={handleStatusUpdated}
              onDeleted={handleDeleted}
            />
          </div>
        </div>
      </DndContext>

      {/* Mobile & Tablet Detail Bottom Sheet */}
      <Modal
        open={mobileDetailOpen && selectedApp !== null}
        onClose={() => setMobileDetailOpen(false)}
        title={selectedApp ? `${selectedApp.companyName} — ${selectedApp.position}` : "Detail Lamaran"}
      >
        <ApplicationDetailPanel
          application={selectedApp}
          onStatusUpdated={handleStatusUpdated}
          onDeleted={handleDeleted}
        />
      </Modal>
    </div>
  );
}
