import type { NextRequest, NextResponse } from "next/server";
import { profileController } from "./profile.controller";

export function handleGetProfile(): Promise<NextResponse> {
  return profileController.getProfile();
}

export function handleUploadCv(req: NextRequest): Promise<NextResponse> {
  return profileController.uploadCv(req);
}

export function handlePreviewCv(): Promise<NextResponse> {
  return profileController.previewCv();
}

export function handleDeleteCv(): Promise<NextResponse> {
  return profileController.deleteCv();
}
