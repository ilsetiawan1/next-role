import { ErrorVisualStage } from "@/components/layout/ErrorVisualStage";

export default function NotFound() {
  return (
    <ErrorVisualStage
      code="404"
      headline="Ups, sepertinya kita tersesat"
      subtitle="Mari kembali ke tempat yang kamu kenal."
      headerActionLabel="Masuk"
      headerActionHref="/login"
    />
  );
}
