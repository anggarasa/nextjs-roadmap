import Link from "next/link";

export default function TasksPage() {
  const DUMMY_TASKS = [
    {
      id: "task-101",
      title: "Membuat Desain UI",
    },
    {
      id: "task-102",
      title: "Setup Database",
    },
    {
      id: "task-103",
      title: "Integrasi API",
    },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pekerjaan</h1>
        <p className="text-sm text-slate-500 mt-1">Pilih tugas untuk melihat parameter detail dinamis.</p>
      </div>

      <div className="space-y-3">
        {DUMMY_TASKS.map((task) => (
          <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors">
            <span className="font-medium text-slate-800 text-sm">{task.title}</span>
            <Link href={`/tasks/${task.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
              Buka Detail →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
