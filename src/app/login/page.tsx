import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/modules/auth/auth.config";
import { AuthCard } from "@/features/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Masuk atau Coba Mode Demo",
  description:
    "Masuk ke ruang kerja NextRole dengan Google atau coba Mode Demo 1-klik tanpa registrasi.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage() {
  await connection();
  const session = await auth();
  if (session?.user?.id) {
    redirect("/home");
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-8 sm:py-12">
      <AuthCard />
    </main>
  );
}
