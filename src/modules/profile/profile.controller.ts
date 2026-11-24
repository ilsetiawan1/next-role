import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth-guard";
import { AppError, handleApiError } from "@/middlewares/error-handler";
import { profileService } from "./profile.service";

export const profileController = {
  async getProfile(): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const data = await profileService.getProfile(user.userId);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async uploadCv(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const formData = await req.formData();
      const fileEntry = formData.get("file");

      if (!(fileEntry instanceof File)) {
        throw new AppError(400, "Field 'file' berupa file PDF wajib disertakan.", "FILE_REQUIRED");
      }

      const arrayBuffer = await fileEntry.arrayBuffer();
      const data = await profileService.uploadCv(user.userId, {
        name: fileEntry.name || "cv.pdf",
        type: fileEntry.type || "application/pdf",
        size: fileEntry.size,
        buffer: Buffer.from(arrayBuffer),
      });

      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async previewCv(): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const data = await profileService.getCvPreviewUrl(user.userId);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteCv(): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const data = await profileService.deleteCv(user.userId);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
