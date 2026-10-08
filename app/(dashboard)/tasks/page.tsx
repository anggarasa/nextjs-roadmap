import { TaskStatusToggle } from "@/components/TaskStatusToggle";
import { Task } from "@/types/task";
import Link from "next/link";

async function getTasks(): Promise<Task[]> {
  // Simulasi permintaan API dengan backend
  // Opsi 1: SSR murni
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const res = await fetch("http://localhost:3000/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": token,
    },
    cache: "no-store", // SSR murni, tidak ada cache
    // Opsi 2: ISR berkala (Incremental Static Regeneration)
    // next: {
    //   revalidate: 30,
    // },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data dari server API");
  }

  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Task (Nest.js Backend)</h1>
          <p className="text-slate-500 text-sm mt-1">Data diambil langsung via komunikasi intra-server Next.js ke Nest.js API.</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">Live Backend Connected</span>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const statusBadgeColor = task.done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : task.done ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200";
          const status = task.status || task.done ? "DONE" : "OPEN"; // Fallback jika status tidak tersedia

          return (
            <div key={task.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-slate-300 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-base">{task.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border ${statusBadgeColor}`}>{status}</span>
                </div>
                <p className="text-xs text-slate-500">{task.description || "Tidak ada deskripsi tambahan"}</p>
              </div>

              <Link href={`/tasks/${task.id}`} className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                Detail →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
