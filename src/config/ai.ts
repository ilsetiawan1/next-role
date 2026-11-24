import { embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getServerEnv } from "./env";

export const AI_MODELS = {
  PARSER_AND_DRAFT: "gemini-3.5-flash-lite",
  EMBEDDING: "gemini-embedding-2",
  EMBEDDING_DIMENSIONS: 768,
} as const;

let cachedProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

export function getGoogleAI() {
  if (cachedProvider) return cachedProvider;
  const { GEMINI_API_KEY } = getServerEnv();
  cachedProvider = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });
  return cachedProvider;
}

/**
 * Menghasilkan vektor embedding 768 dimensi untuk teks CV atau JD menggunakan Gemini Embedding 2.
 */
export async function generateEmbedding768(text: string): Promise<number[]> {
  const google = getGoogleAI();
  const { embedding } = await embed({
    model: google.textEmbeddingModel(AI_MODELS.EMBEDDING),
    value: text.slice(0, 12000),
    providerOptions: {
      google: {
        outputDimensionality: AI_MODELS.EMBEDDING_DIMENSIONS,
      },
    },
  });
  return embedding;
}
