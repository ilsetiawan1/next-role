/**
 * Membersihkan teks whitespace berlebih tanpa menggunakan RegEx (Zero RegEx Policy).
 */
export function normalizeWhitespace(input: string): string {
  const parts = input.trim().split(" ");
  const clean: string[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.length > 0) {
      clean.push(trimmed);
    }
  }
  return clean.join(" ");
}

/**
 * Membentuk nama file aman untuk objek R2 tanpa RegEx (Zero RegEx Policy).
 */
export function sanitizeFileName(fileName: string): string {
  const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-";
  let result = "";
  for (const ch of fileName.trim()) {
    result += allowedChars.includes(ch) ? ch : "-";
  }
  return result.length > 0 ? result : "cv.pdf";
}
