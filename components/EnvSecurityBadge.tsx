"use client";

import { useEffect, useState } from "react";

export function EnvSecurityBadge() {
  const [mounted, setMounted] = useState(false);

  // Ambil nilai environment variables langsung dari runtime client browser
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const privateSecret = process.env.JWT_ACCESS_SECRET;
  const privateNestUrl = process.env.NEST_API_URL;

  useEffect(() => {
    setMounted(true);
    // Log pembuktian garis batas keamanan di browser DevTools Console
    console.log("🛡️ [SECURITY BOUNDARY DEMO] Client-Side Environment Access:");
    console.log("👉 NEXT_PUBLIC_APP_URL (Publik):", publicAppUrl);
    console.log("👉 JWT_ACCESS_SECRET (Privat Server):", privateSecret, "(Otomatis Undefined!)");
    console.log("👉 NEST_API_URL (Privat Server):", privateNestUrl, "(Otomatis Undefined!)");
  }, [publicAppUrl, privateSecret, privateNestUrl]);

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>🔐</span>
            <span>Inspeksi Security Boundary: Server vs NEXT_PUBLIC_ (Topik 41)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pembuktian isolasi keamanan Next.js: Variabel privat server otomatis bernilai <code className="text-red-600 bg-red-50 px-1 py-0.5 rounded font-mono">undefined</code> di Client Component.
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg self-start sm:self-auto">
          Runtime Client Component
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* NEXT_PUBLIC_APP_URL */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-emerald-800">NEXT_PUBLIC_APP_URL</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ Public Inlined
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            Nilai terekspos ke browser bundle:
          </p>
          <div className="font-mono font-bold text-emerald-700 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 truncate">
            {mounted ? (publicAppUrl || "(kosong)") : "Loading..."}
          </div>
        </div>

        {/* JWT_ACCESS_SECRET */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-700">JWT_ACCESS_SECRET</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200">
              🔒 Protected (Server Only)
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Nilai di runtime browser (Anti-Leak):
          </p>
          <div className="font-mono font-bold text-rose-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
            {mounted ? String(privateSecret) : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
}
