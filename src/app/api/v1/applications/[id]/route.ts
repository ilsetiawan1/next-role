import type { NextRequest } from "next/server";
import {
  handleDeleteApplication,
  handleGetApplication,
  handleUpdateApplication,
} from "@/modules/applications/applications.routes";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return handleGetApplication(id);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return handleUpdateApplication(req, id);
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return handleDeleteApplication(id);
}
