import { Task } from "@/types/task";
import Link from "next/link";

async function getTaskById(id: string): Promise<Task> {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": token,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil data dari server API untuk task ID: ${id}`);
  }

  return res.json();
}

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const task = await getTaskById(id);
  const status = task.status || task.done ? "DONE" : "OPEN"; // Fallback jika status tidak tersedia

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <Link href="/tasks" className="text-xs font-semibold text-blue-600 hover:underline">
          ← Kembali ke Daftar Task
        </Link>
        <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">UUID: {task.id}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
      <p className="text-sm text-slate-600 leading-relaxed">{task.description || "Tidak ada deskripsi detail untuk pekerjaan ini."}</p>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
        <div>
          <span className="block font-semibold text-slate-700">Project ID</span>
          <span className="font-mono">{task.projectId}</span>
        </div>
        <div>
          <span className="block font-semibold text-slate-700">Status Pekerjaan</span>
          <span className="font-semibold text-slate-800">{status}</span>
        </div>
      </div>
    </div>
  );
}
