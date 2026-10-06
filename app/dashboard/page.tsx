import { Suspense } from "react";
import CreateTaskButton from "./_components/CreateTaskButton";
import TaskFilter from "./_components/TaskFilter";
import TaskCard from "./_components/TaskCard";

async function getTasks() {
  // Simulasi delay jaringan database/API selama 2 detik
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulasi kondisi error acak untuk menguji error.tsx
  // Ubah menjadi false jika ingin melihat halaman sukses
  const isError = false;
  if (isError) {
    throw new Error("Gagal mengambil data task dari server backend!");
  }

  return [
    { id: 1, title: "Migrasi Database ke PostgreSQL Enterprise", status: "Selesai" },
    { id: 2, title: "Setup Docker Container & Traefik Proxy", status: "Dalam Proses" },
  ];
}

export default async function DashboardPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Task Enterprise</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan pantau aktivitas task secara realtime.</p>
        </div>
        <CreateTaskButton />
      </div>

      <div className="flex items-center justify-between">
        <Suspense fallback={<div className="text-xs text-slate-400">Memuat filter...</div>}>
          <TaskFilter />
        </Suspense>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} id={task.id.toString()} title={task.title} />
        ))}
      </div>
    </div>
  );
}
