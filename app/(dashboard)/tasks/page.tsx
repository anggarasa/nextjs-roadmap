import { createTask } from "@/actions/task-actions";
import { QuickCreateTask } from "@/components/QuickCreateTask";
import { StatusFilterBadge } from "@/components/StatusFilterBadge";
import { TaskSearchBar } from "@/components/TaskSearchBar";
import { TaskStatusButton } from "@/components/TaskStatusButton";
import { TaskStatusToggle } from "@/components/TaskStatusToggle";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/task";
import Link from "next/link";

const fallbackTasks: Task[] = [
  { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true },
  { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false },
  { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false },
  { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false },
];

async function getTasks(): Promise<Task[]> {
  try {
    const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": token,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return fallbackTasks;
    }

    return await res.json();
  } catch {
    return fallbackTasks;
  }
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header Halaman */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management Live</h1>
          <p className="text-sm text-slate-500 mt-1">Terhubung penuh ke REST API Nest.js (Port 3001) & Basis Data PostgreSQL via Prisma.</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">● Live Sync Active</span>
      </div>

      {/* Toolbar Filter & Pencarian (Client State Zustand - Modul 05 Topik 28) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <TaskSearchBar />
        <StatusFilterBadge />
      </div>

      {/* Showcase Pengujian Komponen Primitif Button & Deterministic Override (Modul 05 - Topik 26) */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
        {/* Tombol Utama */}
        <Button variant="primary" size="md">
          ＋ Tambah Task
        </Button>

        {/* Tombol Sekunder */}
        <Button variant="secondary" size="md">
          Ekspor Data
        </Button>

        {/* Tombol Bahaya / Danger Kecil */}
        <Button variant="danger" size="sm">
          Hapus Terpilih
        </Button>

        {/* Uji Override: Memaksa warna hijau pada varian primary */}
        <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">
          Simpan Perubahan (Override Hijau)
        </Button>
      </div>

      {/* Formulir Penambahan Task Cepat via Server Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">Tambah Pekerjaan Baru</h2>
        <form action={createTask} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="hidden" name="projectId" value="3" />
          <input name="title" required minLength={3} placeholder="Judul task (min. 3 karakter)..." className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 focus:border-blue-600" />
          <input name="description" placeholder="Deskripsi singkat..." className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 focus:border-blue-600" />
          <Button type="submit" variant="primary" size="md">
            ＋ Simpan ke Database
          </Button>
        </form>
      </div>

      {/* Daftar Tugas Real-Time dari PostgreSQL */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Daftar Tugas Aktif ({tasks.length})</h2>
        <div className="grid gap-3">
          {tasks.map((task) => {
            const isDone = Boolean(task.done);

            return (
              <div key={task.id} className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-slate-300 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 text-base">{task.title}</p>
                    <Link href={`/tasks/${task.id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      Detail →
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500">{task.description || "Tidak ada deskripsi tambahan"}</p>
                </div>

                {/* Komponen Daun Klien untuk Mutasi Status */}
                <TaskStatusButton taskId={task.id} done={isDone} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
