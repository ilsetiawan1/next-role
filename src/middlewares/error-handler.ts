import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ERROR_MESSAGES } from "@/constants/application";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = "APP_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Mengubah error internal menjadi response JSON aman tanpa membocorkan stack trace.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: ERROR_MESSAGES.INVALID_INPUT,
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  console.error("[API_ERROR]", error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: ERROR_MESSAGES.INTERNAL_ERROR } },
    { status: 500 }
  );
}
