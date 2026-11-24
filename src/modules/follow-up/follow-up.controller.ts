import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth-guard";
import { handleApiError } from "@/middlewares/error-handler";
import { generateFollowUpSchema } from "./follow-up.schema";
import { followUpService } from "./follow-up.service";

export const followUpController = {
  async generate(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const body = await req.json();
      const input = generateFollowUpSchema.parse(body);
      const data = await followUpService.generate(user.userId, input);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
