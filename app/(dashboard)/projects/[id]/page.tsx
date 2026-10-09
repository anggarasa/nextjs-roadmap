import { apiFetch } from "@/lib/api-client";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let project: Project;
  let tasks: Task[];

  try {
    [project, tasks] = await Promise.all([apiFetch<Project>(`/projects/${id}`, { cache: "no-store" }), apiFetch<Task[]>(`/tasks?projectId=${id}`, { cache: "no-store" })]);
  } catch (err: unknown) {
    // Jika backend mengembalikan 404, alihkan ke halaman notFound Next.js
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found") || errorMessage.toLowerCase().includes("tidak ditemukan")) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Info Project */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md">Project ID: {project.id}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{project.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{project.description || "Tidak ada deskripsi project."}</p>
          </div>
          <Link href="/tasks" className="text-xs font-semibold text-blue-600 hover:underline">
            ← Kembali ke Tasks
          </Link>
        </div>
      </div>

      {/* Relational Tasks Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Daftar Pekerjaan Terkait ({tasks.length})</h2>
          <span className="text-xs text-slate-400 font-mono">Parallel Relational Query</span>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Belum ada task yang terhubung ke project ini.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const status = task.status || (task.done ? "DONE" : "OPEN");
              return (
                <div key={task.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{task.title}</h4>
                    <p className="text-xs text-slate-500">{task.description || "Tidak ada deskripsi"}</p>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${
                      status === "DONE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
