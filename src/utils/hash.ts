import { createHash } from "node:crypto";

/**
 * Menghasilkan hash SHA-256 hex untuk deduplikasi input clipper dan CV.
 */
export function sha256Hex(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}
