import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth-guard";
import { handleApiError } from "@/middlewares/error-handler";
import {
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from "./applications.schema";
import { applicationsService } from "./applications.service";

export const applicationsController = {
  async list(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const { searchParams } = new URL(req.url);
      const query = listApplicationsQuerySchema.parse({
        status: searchParams.get("status") ?? undefined,
        q: searchParams.get("q") ?? undefined,
      });
      const data = await applicationsService.listApplications(user.userId, query);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async detail(id: string): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const data = await applicationsService.getApplicationById(user.userId, id);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const body = await req.json();
      const input = createApplicationSchema.parse(body);
      const data = await applicationsService.createApplication(user.userId, input);
      return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async update(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const body = await req.json();
      const input = updateApplicationSchema.parse(body);
      const data = await applicationsService.updateApplication(user.userId, id, input);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateStatus(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const body = await req.json();
      const input = updateApplicationStatusSchema.parse(body);
      const data = await applicationsService.updateStatus(user.userId, id, input);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async remove(id: string): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      await applicationsService.deleteApplication(user.userId, id);
      return NextResponse.json({ data: { deleted: true, id } }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
