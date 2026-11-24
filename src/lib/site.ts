const DEFAULT_SITE_URL = "https://nextrole.vercel.app";

export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_SITE_URL).trim();
  if (raw.length === 0) return DEFAULT_SITE_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
