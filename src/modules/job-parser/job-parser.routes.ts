import type { NextRequest, NextResponse } from "next/server";
import { jobParserController } from "./job-parser.controller";

export function handleExtractJob(req: NextRequest): Promise<NextResponse> {
  return jobParserController.extract(req);
}
