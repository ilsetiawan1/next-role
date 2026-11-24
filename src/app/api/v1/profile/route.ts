import { handleGetProfile } from "@/modules/profile/profile.routes";

export async function GET() {
  return handleGetProfile();
}
