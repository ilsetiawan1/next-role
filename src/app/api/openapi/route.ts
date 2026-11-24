import { NextResponse } from "next/server";
import { buildOpenApiDocument } from "@/config/openapi";

export async function GET() {
  return NextResponse.json(buildOpenApiDocument(), { status: 200 });
}
