import { redirect } from "next/navigation";
import { auth } from "@/modules/auth/auth.config";
import { AuthCard } from "@/features/auth";

export const instant = false;

export default async function LoginPage() {
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
