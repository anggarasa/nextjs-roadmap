"use client";

import { useEffect, useState } from "react";

interface VercelDeploymentBadgeProps {
  serverData?: {
    isVercel?: boolean;
    vercelEnv?: string;
    vercelRegion?: string;
    nestApiUrl?: string;
    appUrl?: string;
    nodeEnv?: string;
  };
}

export function VercelDeploymentBadge({ serverData }: VercelDeploymentBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const [isHttps, setIsHttps] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Status pengujian latensi edge serverless
  const [testingLatency, setTestingLatency] = useState(false);
  const [latencyResult, setLatencyResult] = useState<{
    latencyMs: number;
    status: string;
    region: string;
    provider: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
      setIsHttps(window.location.protocol === "https:");
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  const handleTestLatency = async () => {
    setTestingLatency(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      const end = performance.now();
      setLatencyResult({
        latencyMs: Math.round(end - start),
        status: data.status,
        region: data.platform?.region || "global-edge",
        provider: data.platform?.provider || "Vercel Platform",
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch {
      const end = performance.now();
      setLatencyResult({
        latencyMs: Math.round(end - start),
        status: "error",
        region: "unknown",
        provider: "Offline",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setTestingLatency(false);
    }
  };

  const isVercelPlatform =
    serverData?.isVercel ||
    (typeof window !== "undefined" && window.location.hostname.includes("vercel.app"));

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white border border-slate-800 rounded-3xl shadow-xl mb-6 space-y-5 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          {/* Vercel Logo Triangle */}
          <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black shadow-lg shadow-white/10 shrink-0">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 116 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Vercel Cloud & Edge Architecture
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Topik 42
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspeksi live: Serverless Compute, Global Edge CDN & Continuous Deployment.
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isVercelPlatform
                  ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                  : "bg-blue-400"
              }`}
            />
            <span className="font-mono font-semibold text-slate-200">
              {isVercelPlatform ? "Live on Vercel Edge" : "Local Ready for Vercel"}
            </span>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 ${
              isHttps
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-slate-800/80 border-slate-700 text-slate-400"
            }`}
          >
            <span>{isHttps ? "🔒 SSL/HTTPS" : "🔓 HTTP (Dev)"}</span>
          </div>
        </div>
      </div>

      {/* Grid Informasi Lingkungan Cloud */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10 text-xs">
        {/* Card 1: Domain & Host */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono font-semibold text-[11px]">NEXT_PUBLIC_APP_URL</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700/60 text-slate-300">
              Origin
            </span>
          </div>
          <div className="font-mono font-bold text-cyan-300 truncate bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
            {mounted ? currentOrigin || serverData?.appUrl || "(Loading origin...)" : "Loading..."}
          </div>
          <p className="text-[11px] text-slate-400">
            Domain aktif terpetakan ke Vercel DNS & routing Edge CDN.
          </p>
        </div>

        {/* Card 2: Backend Target */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono font-semibold text-[11px]">NEST_API_URL</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Serverless Proxy
            </span>
          </div>
          <div className="font-mono font-bold text-emerald-400 truncate bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
            {serverData?.nestApiUrl || "http://localhost:3001"}
          </div>
          <p className="text-[11px] text-slate-400">
            Injeksi aman di Vercel Dashboard, tidak bocor ke browser bundle.
          </p>
        </div>

        {/* Card 3: Secret Encryption & Stage */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono font-semibold text-[11px]">JWT_ACCESS_SECRET</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
              KMS Protected
            </span>
          </div>
          <div className="font-mono font-bold text-purple-300 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between">
            <span>•••••••••••••••• (32+ char)</span>
            <span className="text-[10px] text-slate-400">Zod Valid</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Terenkripsi di cloud Vercel, otomatis lolos verifikasi Zod <code className="text-slate-300">lib/env.ts</code>.
          </p>
        </div>
      </div>

      {/* Latency Tester & Edge Health Verification */}
      <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTestLatency}
            disabled={testingLatency}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {testingLatency ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memeriksa Edge CDN...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Uji Latensi Serverless & Edge CDN</span>
              </>
            )}
          </button>

          {latencyResult && (
            <div className="flex items-center gap-2.5 text-xs animate-in fade-in duration-300">
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                {latencyResult.latencyMs} ms
              </span>
              <span className="text-slate-400 text-[11px]">
                Endpoint: <code className="text-cyan-300">/api/health</code> ({latencyResult.provider})
              </span>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="text-emerald-400">✓</span> Zero Downtime
          </span>
          <span className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="text-cyan-400">✓</span> Branch Previews
          </span>
          <span className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="text-purple-400">✓</span> 1-Click Rollback
          </span>
        </div>
      </div>

      {/* CLI Cheatsheet Box */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800/80 space-y-2 text-xs relative z-10">
        <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/50">
          <span className="font-bold text-[11px] text-slate-300 flex items-center gap-1.5">
            <span>⌨️</span>
            <span>Vercel CLI & Deployment Commands:</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Terminal Shortcut</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
          {/* Cmd 1 */}
          <div
            onClick={() => handleCopy("git push origin main", "git")}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between group transition"
          >
            <span className="text-slate-300">git push origin main</span>
            <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">
              {copiedCmd === "git" ? "Tersalin!" : "Webhook"}
            </span>
          </div>

          {/* Cmd 2 */}
          <div
            onClick={() => handleCopy("vercel", "preview")}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between group transition"
          >
            <span className="text-slate-300">vercel</span>
            <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">
              {copiedCmd === "preview" ? "Tersalin!" : "Preview CLI"}
            </span>
          </div>

          {/* Cmd 3 */}
          <div
            onClick={() => handleCopy("vercel --prod", "prod")}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between group transition"
          >
            <span className="text-emerald-400 font-bold">vercel --prod</span>
            <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">
              {copiedCmd === "prod" ? "Tersalin!" : "Prod Hotfix"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
