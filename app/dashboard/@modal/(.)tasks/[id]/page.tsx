"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

export default function TaskModalIntercrepted({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">Intercepted Modal View</span>
          <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1">
            ✕ Tutup
          </button>
        </div>

        <div className="py-4">
          <h2 className="text-xl font-bold text-slate-900">Task Detail #{id}</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">Halaman ini berhasil dicegat secara lokal! Halaman dashboard utama di belakang layar tetap aktif dan tidak kehilangan state.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button onClick={() => router.back()} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
