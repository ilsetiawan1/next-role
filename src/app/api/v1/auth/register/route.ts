import type { NextRequest } from "next/server";
import { handleRegister } from "@/modules/auth/auth.routes";

export async function POST(req: NextRequest) {
  return handleRegister(req);
}
