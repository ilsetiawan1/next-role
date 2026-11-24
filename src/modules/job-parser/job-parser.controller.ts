import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth-guard";
import { handleApiError } from "@/middlewares/error-handler";
import { extractJobInputSchema } from "./job-parser.schema";
import { jobParserService } from "./job-parser.service";

export const jobParserController = {
  async extract(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await requireAuth();
      const body = await req.json();
      const input = extractJobInputSchema.parse(body);
      const result = await jobParserService.extract(user.userId, input);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
