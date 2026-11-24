import type { NextRequest } from "next/server";
import {
  handleCreateApplication,
  handleListApplications,
} from "@/modules/applications/applications.routes";

export async function GET(req: NextRequest) {
  return handleListApplications(req);
}

export async function POST(req: NextRequest) {
  return handleCreateApplication(req);
}
