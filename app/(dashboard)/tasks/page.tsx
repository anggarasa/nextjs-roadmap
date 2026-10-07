import { TaskStatusToggle } from "@/components/TaskStatusToggle";
import { revalidateTag } from "next/cache";
import Link from "next/link";
import { title } from "process";

// export const dynamic = "force-dynamic";
export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

async function getTasks(): Promise<Task[]> {
  // Simulasi permintaan API dengan backend
  // Opsi 1: SSR murni
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3", {
    cache: "no-store", // SSR murni, tidak ada cache
    // Opsi 2: ISR berkala (Incremental Static Regeneration)
    // next: {
    //   revalidate: 30,
    // },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data dari server API");
  }

  const rawData = await res.json();

  return rawData.map((item: any) => ({
    id: `TSK-${item.id}`,
    title: item.title,
    status: item.completed ? "DONE" : "TODO",
    priority: item.id % 2 === 0 ? "HIGH" : "MEDIUM",
  }));
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Pekerjaan Server</h1>
          <p className="text-sm text-slate-500 mt-1">Data dirender langsung oleh React Server Component (0 KB Client Table Markup).</p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold">Active Mode: SSR / On-Demand</span>
      </div>

      {/* Tabel Data 0 KB JavaScript */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Kode ID</th>
              <th className="p-4">Deskripsi Tugas</th>
              <th className="p-4">Prioritas</th>
              <th className="p-4 text-center">Status Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-semibold text-slate-700">{task.id}</td>
                <td className="p-4 font-medium text-slate-900">{task.title}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${task.priority === "HIGH" ? "bg-red-50 text-red-600 border border-red-200" : "bg-slate-100 text-slate-600"}`}>{task.priority}</span>
                </td>
                <td className="p-4 text-center">
                  {/* Menyematkan komponen daun interaktif di dalam sel tabel */}
                  <TaskStatusToggle id={task.id} initialStatus={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
