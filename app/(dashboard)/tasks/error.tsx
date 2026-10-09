"use client";

import { useEffect } from "react";

export default function TaskError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Tracking error boundary tasks:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm space-y-4 animate-in fade-in">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl text-xl font-bold flex items-center justify-center shrink-0">⚠️</span>
        <div>
          <h2 className="text-lg font-bold text-red-900">Gagal Mengambil Data Tasks</h2>
          <p className="text-xs text-red-500 font-mono">{error.digest ? `Digest Code: ${error.digest}` : "Server Connection Error"}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-red-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pesan Kesalahan Backend:</p>
        <p className="text-sm text-red-700 font-medium">{error.message || "Koneksi ke server backend Nest.js terputus atau gagal dijangkau."}</p>
      </div>

      <div className="pt-2 flex gap-3">
        <button onClick={() => reset()} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2 cursor-pointer">
          <span>🔄</span>
          <span>Coba Muat Ulang (Retry)</span>
        </button>
      </div>
    </div>
  );
}
