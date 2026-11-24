"use client";

import { ErrorVisualStage } from "@/components/layout/ErrorVisualStage";

export default function GlobalErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorVisualStage
      code="500"
      headline="Server sedang mengalami kendala"
      subtitle="Data lamaran dan CV kamu tetap aman. Coba muat ulang beberapa saat lagi."
      headerActionLabel="Kembali ke Home"
      headerActionHref="/home"
      onRetry={reset}
    />
  );
}
