"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ensureGsapRegistered, gsap, useGSAP } from "@/lib/gsap";
import { registerAccount } from "../api/authApi";

export function AuthCard() {
  ensureGsapRegistered();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(cardRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform",
        });
      });
    },
    { scope: cardRef }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("credentials");

    try {
      if (mode === "register") {
        await registerAccount({ name, email, password });
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau kata sandi tidak cocok. Silakan periksa kembali.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kendala saat masuk.");
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading("google");
    await signIn("google", { callbackUrl: "/home" });
  }

  async function handleGuestLogin() {
    setError(null);
    setLoading("guest");
    try {
      const result = await signIn("credentials", {
        guest: "true",
        redirect: false,
      });
      if (result?.error) {
        setError("Gagal menyiapkan sesi Mode Demo. Coba lagi.");
        return;
      }
      router.push("/home");
      router.refresh();
    } catch {
      setError("Gagal masuk ke Mode Demo.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      ref={cardRef}
      className="w-full max-w-110 sm:max-w-170 lg:max-w-5xl rounded-4xl bg-white/95 backdrop-blur-xl border border-white shadow-[0_24px_60px_-15px_rgba(2,132,199,0.2)] p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4"
    >
      {/* Blue Visual Banner — Side-by-side characters on Tablet (sm..lg), Stacked on Desktop (lg+) */}
      <div
        className="lg:col-span-5 rounded-3xl p-6 sm:p-7 lg:p-8 text-white flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-end lg:items-stretch gap-4 relative overflow-hidden min-h-50 sm:min-h-62.5 lg:min-h-145"
        style={{
          background: "linear-gradient(135deg, #0B5E98 0%, #0E86C7 55%, #1BB3E3 100%)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-200/20 blur-xs"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-sky-300/20 blur-xs"
        />

        <div className="relative z-10 sm:max-w-[54%] lg:max-w-none self-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>

          <h1 className="mt-5 sm:mt-6 text-2xl sm:text-[26px] lg:text-3xl font-bold leading-tight tracking-tight">
            Kelola lamaran kerja lebih tenang di satu ruang.
          </h1>
          {/* Curved Neon Lime Accent Swoosh persis FigCraft */}
          <svg
            aria-hidden="true"
            viewBox="0 0 180 14"
            fill="none"
            className="mt-1.5 w-36 h-3 text-[#D4FF47]"
          >
            <path
              d="M 2 9 Q 90 1 178 8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-2.5 text-xs sm:text-sm text-sky-100 leading-relaxed">
            Arsip iklan permanen, skor kecocokan CV otomatis, dan pengingat follow-up H+7.
          </p>
        </div>

        {/* 3D Characters — Visible on Tablet (right side) & Desktop (bottom center) */}
        <div className="relative z-10 hidden sm:flex justify-end lg:justify-center -mb-7 lg:-mb-8 shrink-0">
          <Image
            src="/images/auth/characters.png"
            alt="Ilustrasi pengguna NextRole"
            width={340}
            height={300}
            className="w-52 lg:w-full lg:max-w-75 h-auto object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 py-6 sm:px-10 sm:py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-center gap-2.5">
            <Image
              src="/images/brand/android-chrome-192x192.png"
              alt="NextRole Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-lg font-bold tracking-tight text-slate-900">nextrole</span>
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {mode === "login"
                ? "Masuk untuk melanjutkan ruang kerja lamaranmu"
                : "Mulai rapikan seluruh proses pencarian kerjamu"}
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {mode === "register" ? (
              <div>
                <label className="sr-only" htmlFor="auth-name">
                  Nama Lengkap
                </label>
                <Input
                  id="auth-name"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  className="bg-slate-100/85 border-transparent focus:bg-white"
                />
              </div>
            ) : null}

            <div>
              <label className="sr-only" htmlFor="auth-email">
                Alamat Email
              </label>
              <Input
                id="auth-email"
                type="email"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-100/85 border-transparent focus:bg-white"
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="auth-password">
                Kata Sandi
              </label>
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="pr-11 bg-slate-100/85 border-transparent focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading !== null}
            >
              {loading === "credentials"
                ? "Memproses..."
                : mode === "login"
                  ? "Masuk"
                  : "Daftar Sekarang"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">Atau lanjutkan dengan</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4 3.1C6.23 6.87 8.88 4.76 12 4.76Z"
                />
              </svg>
              {loading === "google" ? "Menghubungkan..." : "Google"}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleGuestLogin}
              disabled={loading !== null}
              className="w-full"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#84CC16]" />
              {loading === "guest" ? "Menyiapkan..." : "Mode Demo"}
            </Button>
          </div>

          <p className="mt-7 text-center text-xs text-slate-500">
            {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              className="font-semibold text-[#0284C7] hover:underline cursor-pointer"
            >
              {mode === "login" ? "Daftar" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
