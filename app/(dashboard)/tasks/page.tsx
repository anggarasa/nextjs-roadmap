import { QuickCreateTask } from "@/components/QuickCreateTask";
import { TaskStatusToggle } from "@/components/TaskStatusToggle";
import { Task } from "@/types/task";
import Link from "next/link";

async function getTasks(): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulasi permintaan API dengan backend
  // Opsi 1: SSR murni
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": token,
    },
    // cache: "no-store", // SSR murni, tidak ada cache
    // Opsi 2: ISR berkala (Incremental Static Regeneration)
    // next: {
    //   tags: ["tasks"],
    //   revalidate: 3600,
    // },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || `Gagal mengambil data dari Nest.js API backend (Status: ${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();

  const cacheTimestamp = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md">CACHE: Tag-Based Active (&apos;tasks&apos;)</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Daftar Task Enterprise</h1>
          <p className="text-slate-500 text-sm">Respons disajikan instan dari Next.js Data Cache.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Cache Snapshot At:</span>
            <span className="text-base font-mono font-bold text-purple-600">{cacheTimestamp}</span>
          </div>
          <QuickCreateTask />
          <Link href="/tasks/create" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center gap-1.5">
            ＋ Form Task Baru
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => {
          const status = task.status || (task.done ? "DONE" : "OPEN");

          return (
            <div key={task.id} className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-slate-300 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{task.title}</h3>
                  <Link href={`/tasks/${task.id}`} className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Detail →
                  </Link>
                </div>
                <p className="text-xs text-slate-500">{task.description || "Tidak ada deskripsi tambahan"}</p>
              </div>

              {/* Tombol aksi pemicu mutasi & on-demand purge */}
              <TaskStatusToggle id={task.id} initialStatus={status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
