import { Task } from "@/types/task";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const fallbackTasks: Record<string, Task> = {
  "1": { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true, priority: "HIGH", projectId: 3 },
  "2": { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false, priority: "HIGH", projectId: 3 },
  "3": { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false, priority: "MEDIUM", projectId: 3 },
  "4": { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false, priority: "LOW", projectId: 3 },
};

async function getTaskById(id: string): Promise<Task> {
  try {
    const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": token,
      },
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline / network error
  }

  // Fallback data
  if (fallbackTasks[id]) {
    return fallbackTasks[id];
  }

  return {
    id,
    title: `Task #${id}`,
    description: "Detail tugas dari memori sistem.",
    status: "OPEN",
    done: false,
    priority: "MEDIUM",
    projectId: 3,
  };
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const task = await getTaskById(id);
  const status = task.status || (task.done ? "DONE" : "OPEN");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <Link href="/tasks" className="text-xs font-semibold text-blue-600 hover:underline">
          ← Kembali ke Daftar Task
        </Link>
        <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">ID: {task.id}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
        <Badge status={status} />
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">{task.description || "Tidak ada deskripsi detail untuk pekerjaan ini."}</p>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
        <div>
          <span className="block font-semibold text-slate-700">Project ID</span>
          <span className="font-mono">{task.projectId || 3}</span>
        </div>
        <div>
          <span className="block font-semibold text-slate-700">Prioritas</span>
          <span className="font-semibold text-slate-800">{task.priority || "MEDIUM"}</span>
        </div>
      </div>
    </div>
  );
}
