"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TaskFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const setFilter = (status: string) => {
    router.push(`/dashboard/tasks?status=${status}`);
  };

  return (
    <div className="flex gap-2">
      {["all", "pending", "completed"].map((status) => (
        <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-xs rounded-md font-medium uppercase ${currentStatus === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          {status}
        </button>
      ))}
    </div>
  );
}
