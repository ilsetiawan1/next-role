import { z } from "zod";
import { APPLICATION_STATUSES } from "@/constants/application";

export const createApplicationSchema = z.object({
  companyName: z.string().trim().min(1, "Nama perusahaan wajib diisi").max(150),
  position: z.string().trim().min(1, "Posisi pekerjaan wajib diisi").max(150),
  location: z.string().trim().max(150).nullable().optional(),
  employmentType: z.string().trim().max(80).nullable().optional(),
  salaryRange: z.string().trim().max(120).nullable().optional(),
  jobSource: z.string().trim().max(100).nullable().optional(),
  jobUrl: z.string().trim().url("Format URL lowongan tidak valid").nullable().optional(),
  keyRequirements: z.array(z.string().trim().min(1)).max(15).default([]),
  jdSnapshot: z.string().trim().max(30000).nullable().optional(),
  recruiterName: z.string().trim().max(120).nullable().optional(),
  recruiterContact: z.string().trim().max(180).nullable().optional(),
  appliedAt: z.string().datetime().optional(),
});

export const updateApplicationSchema = z.object({
  companyName: z.string().trim().min(1).max(150).optional(),
  position: z.string().trim().min(1).max(150).optional(),
  location: z.string().trim().max(150).nullable().optional(),
  employmentType: z.string().trim().max(80).nullable().optional(),
  salaryRange: z.string().trim().max(120).nullable().optional(),
  jobSource: z.string().trim().max(100).nullable().optional(),
  jobUrl: z.string().trim().url("Format URL lowongan tidak valid").nullable().optional(),
  keyRequirements: z.array(z.string().trim().min(1)).max(15).optional(),
  jdSnapshot: z.string().trim().max(30000).nullable().optional(),
  recruiterName: z.string().trim().max(120).nullable().optional(),
  recruiterContact: z.string().trim().max(180).nullable().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
  interviewAt: z.string().datetime().nullable().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  interviewAt: z.string().datetime().nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
});

export const listApplicationsQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  q: z.string().trim().max(120).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
