"use client";

import { updateTaskStatus } from "@/actions/task-actions";
import { useState } from "react";

export function TaskStatusToggle({ id, initialStatus }: { id: string | number; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const nextStatus = status === "DONE" ? "OPEN" : "DONE";

    try {
      await updateTaskStatus(id, nextStatus);
      setStatus(nextStatus);
    } catch (error) {
      console.error("Gagal memperbarui task");
    } finally {
      setLoading(false);
    }
  };

  const isDone = status === "DONE";

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold font-mono border transition disabled:opacity-50 ${
        isDone ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      }`}
    >
      {loading ? "Menyimpan..." : isDone ? "✓ DONE" : "⏱ OPEN"}
    </button>
  );
}
