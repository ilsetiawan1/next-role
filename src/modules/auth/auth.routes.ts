import type { NextRequest, NextResponse } from "next/server";
import { authController } from "./auth.controller";

export function handleRegister(req: NextRequest): Promise<NextResponse> {
  return authController.register(req);
}

export function handleGuestDemo(): Promise<NextResponse> {
  return authController.guestDemo();
}
