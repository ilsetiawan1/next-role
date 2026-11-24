import type { NextRequest, NextResponse } from "next/server";
import { followUpController } from "./follow-up.controller";

export function handleGenerateFollowUp(req: NextRequest): Promise<NextResponse> {
  return followUpController.generate(req);
}
