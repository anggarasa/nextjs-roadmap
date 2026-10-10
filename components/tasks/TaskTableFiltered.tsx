"use client";

import { useTaskFilterStore } from "@/stores/useTaskFilterStore";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Task } from "@/types/task";

export function TaskTableFiltered({ tasks }: { tasks: Task[] | any[] }) {
  // Membaca state filter secara atomik dari Zustand store
  const search = useTaskFilterStore((s) => s.search);
  const status = useTaskFilterStore((s) => s.status);

  // Penyaringan data instan di memori klien (Zero Network Lag)
  const filteredTasks = tasks.filter((task) => {
    const currentStatus = task.status || (task.done ? "DONE" : "OPEN");
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "ALL" ? true : currentStatus === status;
    return matchSearch && matchStatus;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-slate-400 text-sm">Tidak ada tugas yang sesuai dengan kriteria filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="p-4">Deskripsi Tugas</th>
            <th className="p-4">Prioritas</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {filteredTasks.map((task) => {
            const currentStatus = task.status || (task.done ? "DONE" : "OPEN");
            return (
              <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{task.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{task.description || "Tanpa deskripsi"}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{task.priority || "MEDIUM"}</span>
                </td>
                <td className="p-4">
                  <Badge status={currentStatus} />
                </td>
                <td className="p-4 text-right">
                  <Link href={`/dashboard/tasks/${task.id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                    Detail →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
