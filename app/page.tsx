import Link from "next/link";
import { env } from "@/lib/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Manager Enterprise — Cloud Live on Vercel",
  description:
    "Aplikasi Task Manager Full-Stack Next.js 16 & Nest.js yang terdeploy di Vercel Global Edge Network.",
};

export default function HomePage() {
  const isVercel = Boolean(process.env.VERCEL || env.VERCEL);
  const vercelEnv =
    process.env.VERCEL_ENV ||
    env.VERCEL_ENV ||
    (env.NODE_ENV === "production" ? "production" : "development");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Background radial gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Navbar Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-md">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 116 100">
                <path d="M57.5 0L115 100H0L57.5 0Z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white font-sans">
              Task Manager <span className="text-cyan-400">Cloud</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isVercel ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}`} />
              <span>{isVercel ? `Vercel (${vercelEnv})` : "Local Edge Dev"}</span>
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center space-y-8 my-auto">
        {/* Topic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
          <span>▲</span>
          <span>Modul 08 · Topik 42: Deploy ke Vercel</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">Farhan Coders</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Next.js Enterprise <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Live on Vercel Global Edge
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          Dashboard manajemen tugas modern dengan arsitektur Serverless Compute,
          kompresi Edge CDN otomatis, dan validasi Environment multi-stage berbasis skema Zod yang ketat.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/dashboard/tasks"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>Buka Dashboard Tugas</span>
          </Link>

          <Link
            href="/api/health"
            target="_blank"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl text-sm font-medium active:scale-95 transition flex items-center justify-center gap-2 font-mono"
          >
            <span>⚡</span>
            <span>Inspect /api/health</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🌐</span>
              <span>Global Edge CDN</span>
            </div>
            <p className="text-xs text-slate-400">
              Font, gambar Next.js, dan static bundle dialirkan otomatis dari server terdekat pengguna.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>⚡</span>
              <span>Serverless Compute</span>
            </div>
            <p className="text-xs text-slate-400">
              Server Actions dan RSC dieksekusi secara terisolasi tanpa perlu mengelola OS server mandiri.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Fail-Safe Zod Cloud</span>
            </div>
            <p className="text-xs text-slate-400">
              Build pipeline gagal otomatis di cloud jika rahasia environment tertinggal atau cacat format.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          Task Manager Dashboard · Dibuat untuk Masterclass Next.js Enterprise oleh Farhan Coders.
        </p>
      </footer>
    </main>
  );
}
