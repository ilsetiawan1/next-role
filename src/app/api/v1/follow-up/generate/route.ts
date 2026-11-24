import type { NextRequest } from "next/server";
import { handleGenerateFollowUp } from "@/modules/follow-up/follow-up.routes";

export async function POST(req: NextRequest) {
  return handleGenerateFollowUp(req);
}
