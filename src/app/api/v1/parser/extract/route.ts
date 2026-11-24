import type { NextRequest } from "next/server";
import { handleExtractJob } from "@/modules/job-parser/job-parser.routes";

export async function POST(req: NextRequest) {
  return handleExtractJob(req);
}
