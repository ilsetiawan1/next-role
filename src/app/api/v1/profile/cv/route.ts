import type { NextRequest } from "next/server";
import { handleDeleteCv, handleUploadCv } from "@/modules/profile/profile.routes";

export async function PUT(req: NextRequest) {
  return handleUploadCv(req);
}

export async function DELETE() {
  return handleDeleteCv();
}
