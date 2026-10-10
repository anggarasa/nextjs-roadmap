"use client";

import { useTaskFilterStore } from "@/stores/useTaskFilterStore";

export function TaskSearchBar() {
  const search = useTaskFilterStore((s) => s.search);
  const setSearch = useTaskFilterStore((s) => s.setSearch);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari tugas dashboard..."
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
      />
      {search && (
        <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">
          ✕
        </button>
      )}
    </div>
  );
}
