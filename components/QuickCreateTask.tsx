"use client";

import { createTaskAction } from "@/actions/task-actions";
import { useState } from "react";

export function QuickCreateTask() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createTaskAction({
        title: "Review PR Nest.js integrasi endpoint dan prisma schema",
        projectId: 3,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan task baru");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 shadow-sm flex items-center gap-2 cursor-pointer">
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
          <span>Memproses...</span>
        </>
      ) : (
        "＋ Tambah Quick Task"
      )}
    </button>
  );
}
