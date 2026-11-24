import { handleGuestDemo } from "@/modules/auth/auth.routes";

export async function POST() {
  return handleGuestDemo();
}
