import { AI_MODELS } from "@/config/ai";

/**
 * Mengonversi array angka embedding menjadi literal vector PostgreSQL (`[v1,v2,...]`).
 */
export function toVectorLiteral(embedding: readonly number[]): string {
  if (embedding.length !== AI_MODELS.EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Dimensi vektor harus ${AI_MODELS.EMBEDDING_DIMENSIONS}, diterima ${embedding.length}.`
    );
  }

  const formatted: string[] = [];
  for (const val of embedding) {
    if (!Number.isFinite(val)) {
      throw new Error("Nilai vektor mengandung angka tidak valid.");
    }
    formatted.push(String(val));
  }

  return `[${formatted.join(",")}]`;
}

/**
 * Mengonversi cosine distance pgvector (`<=>`, rentang 0..2) menjadi matchScore 0..100.
 */
export function cosineDistanceToMatchScore(distance: number | null | undefined): number | null {
  if (distance === null || distance === undefined || !Number.isFinite(distance)) {
    return null;
  }
  const similarity = 1 - distance;
  const clamped = Math.max(0, Math.min(1, similarity));
  return Math.round(clamped * 100);
}
