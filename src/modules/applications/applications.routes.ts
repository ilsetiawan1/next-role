import type { NextRequest, NextResponse } from "next/server";
import { applicationsController } from "./applications.controller";

export function handleListApplications(req: NextRequest): Promise<NextResponse> {
  return applicationsController.list(req);
}

export function handleCreateApplication(req: NextRequest): Promise<NextResponse> {
  return applicationsController.create(req);
}

export function handleGetApplication(id: string): Promise<NextResponse> {
  return applicationsController.detail(id);
}

export function handleUpdateApplication(req: NextRequest, id: string): Promise<NextResponse> {
  return applicationsController.update(req, id);
}

export function handleUpdateApplicationStatus(req: NextRequest, id: string): Promise<NextResponse> {
  return applicationsController.updateStatus(req, id);
}

export function handleDeleteApplication(id: string): Promise<NextResponse> {
  return applicationsController.remove(id);
}
