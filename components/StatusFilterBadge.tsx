"use client";

import { TaskStatus, useTaskFilterStore } from "@/stores/useTaskFilterStore";

export function StatusFilterBadge() {
  const status = useTaskFilterStore((s) => s.status);
  const setStatus = useTaskFilterStore((s) => s.setStatus);

  const filterOptions: TaskStatus[] = ["ALL", "OPEN", "DONE"];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
      {filterOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => setStatus(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${status === opt ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
