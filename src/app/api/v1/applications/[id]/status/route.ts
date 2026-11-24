import type { NextRequest } from "next/server";
import { handleUpdateApplicationStatus } from "@/modules/applications/applications.routes";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return handleUpdateApplicationStatus(req, id);
}
