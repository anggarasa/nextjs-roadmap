"use client";

import { useState } from "react";

export function TaskStatusToggle({ id, initialStatus }: { id: string; initialStatus: "TODO" | "IN_PROGRESS" | "DONE" }) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    setStatus((prev) => (prev === "DONE" ? "TODO" : "DONE"));
    setIsUpdating(false);
  };

  const isDone = status === "DONE";

  return (
    <button
      onClick={toggleStatus}
      disabled={isUpdating}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border disabled:opacity-50 ${
        isDone ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      }`}
    >
      {isUpdating ? "Menyimpan..." : isDone ? "✓ Selesai" : "⏱ Kerjakan"}
    </button>
  );
}
