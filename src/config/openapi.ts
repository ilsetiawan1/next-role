import { authOpenApiPaths } from "@/modules/auth/auth.openapi";
import { jobParserOpenApiPaths } from "@/modules/job-parser/job-parser.openapi";
import { applicationsOpenApiPaths } from "@/modules/applications/applications.openapi";
import { profileOpenApiPaths } from "@/modules/profile/profile.openapi";
import { followUpOpenApiPaths } from "@/modules/follow-up/follow-up.openapi";

export function buildOpenApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: "NextRole API",
      version: "1.0.0",
      description:
        "Dokumentasi REST API NextRole — AI-Assisted Job Application Tracker (Auth, Job Parser, Applications + pgvector Match Score, Profile CV R2, dan Follow-Up Generator).",
    },
    servers: [{ url: "/", description: "Current Environment" }],
    tags: [
      { name: "Auth", description: "Registrasi, Google OAuth, dan 1-Click Guest Demo" },
      { name: "Job Parser", description: "Ekstraksi lowongan AI dengan cache SHA-256 & kuota 20/hari" },
      { name: "Applications", description: "CRUD lamaran, Kanban status, ActivityLog, dan pgvector match score" },
      { name: "Profile & CV", description: "Manajemen profil, upload CV PDF ke R2 Private Bucket, dan Presigned URL" },
      { name: "Follow-Up", description: "Kalkulasi H+7 dan generator draf follow-up ID/EN" },
    ],
    paths: {
      ...authOpenApiPaths,
      ...jobParserOpenApiPaths,
      ...applicationsOpenApiPaths,
      ...profileOpenApiPaths,
      ...followUpOpenApiPaths,
    },
  };
}
