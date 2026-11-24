import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/middlewares/error-handler";
import { registerSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authController = {
  async register(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const input = registerSchema.parse(body);
      const user = await authService.register(input);
      return NextResponse.json({ data: user }, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async guestDemo(): Promise<NextResponse> {
    try {
      const guest = await authService.provisionGuestUser();
      return NextResponse.json({ data: guest }, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
