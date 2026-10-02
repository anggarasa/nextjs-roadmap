"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Terjadi kesalahan di Dashboard:", error);
  }, [error]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <h2 className="text-lg font-bold text-red-700 mb-2">Gagal Memuat Halaman Dashboard</h2>
      <p className="text-sm text-red-600 mb-4">{error.message}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
        Coba Lagi (Reset)
      </button>
    </div>
  );
}
