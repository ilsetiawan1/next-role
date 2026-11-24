import { handlePreviewCv } from "@/modules/profile/profile.routes";

export async function GET() {
  return handlePreviewCv();
}
