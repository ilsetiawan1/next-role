"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { ArrowUpRight, GripVertical, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ApplicationDetailPanel,
  ApplicationDetailSheet,
  updateApplicationStatusApi,
} from "@/features/application-detail";
import {
  formatShortDateId,
  getCompanyInitial,
  type ApplicationDto,
} from "@/features/shared/workspace-types";
import { cn } from "@/lib/cn";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import {
  filterApplicationsForFolder,
  KANBAN_FOLDERS,
  mapStatusToKanbanFolder,
  type KanbanFolderDefinition,
  type KanbanFolderId,
} from "../types/kanban.types";

/**
 * Komponen Folder 3D persis FigCraft:
 * - Outer card rounded-[20px] penuh (w-full)
 * - 2 lembaran dokumen putih + garis teks tipis mengintip di slot atas
 * - Saku depan berlekuk S-curve kiri-atas ke kanan (biru transparan saat aktif, putih bersih saat nonaktif)
 * - Font weight tenang (font-normal / font-medium) persis tipografi FigCraft
 */
function FolderDropzone({
  droppableId,
  folder,
  count,
  active,
  compact = false,
  onSelect,
}: {
  droppableId: string;
  folder: KanbanFolderDefinition;
  count: number;
  active: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const displayTitle =
    compact && folder.id === "FOLLOW_UP_NEEDED"
      ? "Follow-Up"
      : compact && folder.id === "REJECTED_OR_GHOSTED"
        ? "Rejected"
        : folder.title;

  const isFollowUp = folder.id === "FOLLOW_UP_NEEDED";

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full text-left rounded-[20px] overflow-hidden transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
        active
          ? "shadow-[0_14px_30px_-8px_rgba(2,132,199,0.38)]"
          : "border border-slate-200/80 shadow-[0_6px_18px_-6px_rgba(15,23,42,0.06)] hover:border-sky-200",
        isOver && "ring-2 ring-[#D4FF47] scale-[1.02]"
      )}
      style={{
        background: active
          ? "linear-gradient(180deg, #16A3E4 0%, #0B8BD3 100%)"
          : "#EFF4F9",
      }}
    >
      {/* Top Folder Recess + 2 Peeking Document Sheets */}
      <div className={cn("relative w-full overflow-hidden", compact ? "h-10" : "h-12")}>
        {/* Back ghost paper sheet */}
        <div
          className={cn(
            "absolute left-1/2 translate-x-[-53%] top-1.5 rounded-t-xl transition-transform duration-200 group-hover:-translate-y-0.5",
            compact ? "w-[74%] h-9" : "w-[72%] h-11",
            active ? "bg-white/35" : "bg-slate-200/70"
          )}
        />
        {/* Front crisp white document sheet with 2 subtle text lines */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-2.5 rounded-t-xl bg-white shadow-xs px-3 pt-2 space-y-1.5 transition-transform duration-200 group-hover:-translate-y-0.5",
            compact ? "w-[72%] h-9" : "w-[70%] h-11"
          )}
        >
          <div className="h-1 w-3/5 rounded-full bg-slate-200/90" />
          <div className="h-1 w-4/5 rounded-full bg-slate-100" />
        </div>
      </div>

      {/* Front Folder Pocket with Signature FigCraft Stepped S-Curve Lip */}
      <div className="relative -mt-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 240 24"
          preserveAspectRatio="none"
          className="block w-full h-5"
        >
          <path
            d="M 0 0 L 74 0 Q 86 0 94 10 Q 102 20 116 20 L 240 20 L 240 24 L 0 24 Z"
            fill={active ? "rgba(42, 174, 238, 0.88)" : "#FFFFFF"}
          />
          <path
            d="M 0 0.75 L 74 0.75 Q 86 0.75 94 10.5 Q 102 20 116 20 L 240 20"
            fill="none"
            stroke={active ? "rgba(255,255,255,0.42)" : "#E2E8F0"}
            strokeWidth="1.2"
          />
        </svg>

        <div
          className={cn(
            "relative",
            compact ? "px-3 pb-3 pt-1" : "px-4 pb-4 pt-1.5",
            active ? "text-white" : "bg-white text-slate-900"
          )}
          style={
            active
              ? {
                  background:
                    "linear-gradient(180deg, rgba(42, 174, 238, 0.88) 0%, #0689D1 100%)",
                }
              : undefined
          }
        >
          <p
            className={cn(
              "font-normal tracking-tight truncate",
              compact ? "text-sm" : "text-[17px]",
              active ? "text-white" : "text-slate-900"
            )}
          >
            {displayTitle}
          </p>

          <p
            className={cn(
              "font-normal truncate mt-0.5 flex items-center gap-1.5",
              compact ? "text-[10px]" : "text-xs",
              active ? "text-sky-100" : "text-slate-500"
            )}
          >
            {isFollowUp && !active ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#A3E635] border border-lime-700/40 shrink-0" />
                <span>{count} tepat H+7</span>
              </>
            ) : (
              folder.subtitle
            )}
          </p>

          <div className={compact ? "mt-2" : "mt-3.5"}>
            {active ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full bg-[#D4FF47] font-medium text-[#0C4A6E]",
                  compact ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
                )}
              >
                {count} lamaran
              </span>
            ) : (
              <span
                className={cn(
                  "inline-block font-normal text-slate-700",
                  compact ? "text-xs" : "text-sm"
                )}
              >
                {count} lamaran
              </span>
            )}
          </div>
        </div>
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
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: app.id,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      className={cn(
        "glass-surface rounded-2xl p-4 transition-colors cursor-pointer border",
        selected ? "border-[#0284C7] ring-2 ring-sky-500/20" : "border-sky-100/80 hover:border-sky-200",
        isDragging && "opacity-35 border-dashed border-sky-400"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 font-medium text-sm flex items-center justify-center shrink-0">
            {getCompanyInitial(app.companyName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{app.companyName}</p>
            <p className="text-xs font-normal text-slate-500 truncate">
              {app.location ?? app.employmentType ?? "Lokasi belum diisi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#0284C7]">
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

      <p className="mt-3 text-sm font-normal text-slate-900 truncate">{app.position}</p>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="font-normal text-slate-700 truncate">
          {app.salaryRange ?? "Gaji belum dicantumkan"}
        </span>
        <span className="font-normal text-slate-500 shrink-0">
          Dilamar: {formatShortDateId(app.appliedAt)}
        </span>
      </div>
    </div>
  );
}

export function KanbanWorkspace({ initialApplications }: { initialApplications: ApplicationDto[] }) {
  ensureGsapRegistered();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [applications, setApplications] = useState<ApplicationDto[]>(initialApplications);
  const [activeFolder, setActiveFolder] = useState<KanbanFolderId>("APPLIED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
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
  const draggingApp = draggingId ? applications.find((a) => a.id === draggingId) ?? null : null;

  // GSAP stagger entrance when switching active folder (clearProps keeps DnD transforms clean)
  useGSAP(
    () => {
      if (!boardRef.current) return;
      const cards = boardRef.current.querySelectorAll(".kanban-card-slot");
      if (cards.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          cards,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.34,
            stagger: 0.045,
            ease: "power2.out",
            clearProps: "transform,opacity",
          }
        );
      });
    },
    { scope: boardRef, dependencies: [activeFolder] }
  );

  // Smooth GSAP slide transition on right-side Detail Inspector when selected card/status changes
  useGSAP(
    () => {
      if (!boardRef.current) return;
      const stage = boardRef.current.querySelector(".kanban-detail-stage");
      if (!stage) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          stage,
          { x: 10, opacity: 0.3 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", clearProps: "transform" }
        );
      });
    },
    { scope: boardRef, dependencies: [selectedApp?.id, selectedApp?.status] }
  );

  function handleDragStart(event: DragStartEvent) {
    setDraggingId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setDraggingId(null);
    const appId = String(event.active.id);
    const rawOverId = event.over?.id ? String(event.over.id) : null;
    if (!rawOverId) return;

    const targetFolderId = (
      rawOverId.includes(":") ? rawOverId.slice(rawOverId.indexOf(":") + 1) : rawOverId
    ) as KanbanFolderId;

    const targetFolder = KANBAN_FOLDERS.find((f) => f.id === targetFolderId);
    const currentApp = applications.find((a) => a.id === appId);
    if (!targetFolder || !currentApp) return;

    if (mapStatusToKanbanFolder(currentApp.status) === targetFolder.id) return;

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
    <div ref={boardRef} className="space-y-5 sm:space-y-6">
      {/* Header + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl sm:text-[28px] font-normal text-slate-900 tracking-tight">
            Papan Lamaran
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-0.5">
            Kelola {applications.length} lamaran aktif terstruktur dalam 5 tahapan pipeline
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

      <DndContext
        id="kanban-dnd-context"
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragCancel={() => setDraggingId(null)}
        onDragEnd={handleDragEnd}
      >
        {/* MOBILE 2+3 ASYMMETRIC FOLDER GRID (EXACT FigCraft Mobile 390x844) */}
        <div className="md:hidden space-y-2.5">
          <div className="grid grid-cols-12 gap-2.5">
            <div className="col-span-7">
              <FolderDropzone
                droppableId={`mobile:${KANBAN_FOLDERS[0].id}`}
                folder={KANBAN_FOLDERS[0]}
                count={folderCounts.get(KANBAN_FOLDERS[0].id) ?? 0}
                active={activeFolder === KANBAN_FOLDERS[0].id}
                compact
                onSelect={() => setActiveFolder(KANBAN_FOLDERS[0].id)}
              />
            </div>
            <div className="col-span-5">
              <FolderDropzone
                droppableId={`mobile:${KANBAN_FOLDERS[1].id}`}
                folder={KANBAN_FOLDERS[1]}
                count={folderCounts.get(KANBAN_FOLDERS[1].id) ?? 0}
                active={activeFolder === KANBAN_FOLDERS[1].id}
                compact
                onSelect={() => setActiveFolder(KANBAN_FOLDERS[1].id)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {KANBAN_FOLDERS.slice(2).map((folder) => (
              <FolderDropzone
                key={folder.id}
                droppableId={`mobile:${folder.id}`}
                folder={folder}
                count={folderCounts.get(folder.id) ?? 0}
                active={activeFolder === folder.id}
                compact
                onSelect={() => setActiveFolder(folder.id)}
              />
            ))}
          </div>
        </div>

        {/* TABLET & DESKTOP SINGLE-ROW 5-FOLDER GRID (EXACT FigCraft 834 & 1440) */}
        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {KANBAN_FOLDERS.map((folder) => (
            <FolderDropzone
              key={folder.id}
              droppableId={`desktop:${folder.id}`}
              folder={folder}
              count={folderCounts.get(folder.id) ?? 0}
              active={activeFolder === folder.id}
              onSelect={() => setActiveFolder(folder.id)}
            />
          ))}
        </div>

        {/* Split-View: Kartu Lamaran (Kiri) + Persistent Inspector (Tablet md+ & Desktop xl+) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
          <div className="md:col-span-6 xl:col-span-7 space-y-4">
            <div>
              <h2 className="text-base font-medium text-slate-900">
                {activeFolderMeta.title}{" "}
                <span className="font-normal text-slate-500">({visibleApps.length} Lamaran)</span>
              </h2>
              <p className="hidden md:block text-xs font-normal text-slate-500">
                Pilih kartu di bawah untuk melihat arsip lengkap &amp; kelola status
              </p>
            </div>

            {visibleApps.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                {visibleApps.map((app) => (
                  <div key={app.id} className="kanban-card-slot">
                    <DraggableApplicationCard
                      app={app}
                      selected={selectedApp?.id === app.id}
                      onSelect={() => {
                        setSelectedId(app.id);
                        if (window.innerWidth < 768) {
                          setMobileDetailOpen(true);
                        }
                      }}
                    />
                  </div>
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
              className="w-full h-12 rounded-2xl border border-dashed border-sky-300 bg-white/70 hover:bg-white text-xs font-semibold text-[#0284C7] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Lamaran Baru ke Folder Applied
            </button>
          </div>

          {/* Persistent Inspector visible on BOTH Tablet (md+) AND Desktop (xl+) */}
          <div className="kanban-detail-stage hidden md:block md:col-span-6 xl:col-span-5 sticky top-24">
            <ApplicationDetailPanel
              application={selectedApp}
              onStatusUpdated={handleStatusUpdated}
              onDeleted={handleDeleted}
            />
          </div>
        </div>

        {/* Smooth 60fps DragOverlay without CSS transition lag */}
        <DragOverlay dropAnimation={null}>
          {draggingApp ? (
            <div className="w-72 rounded-2xl bg-white border-2 border-[#0284C7] shadow-2xl p-3.5 pointer-events-none">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700 font-medium text-xs flex items-center justify-center shrink-0">
                  {getCompanyInitial(draggingApp.companyName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {draggingApp.companyName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{draggingApp.position}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Mobile Detail Bottom Sheet (persis FigCraft Mobile Bottom Sheet 390x844) */}
      <ApplicationDetailSheet
        open={mobileDetailOpen && selectedApp !== null}
        onClose={() => setMobileDetailOpen(false)}
        application={selectedApp}
        onStatusUpdated={handleStatusUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
