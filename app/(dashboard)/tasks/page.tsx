import { TaskStatusToggle } from "@/components/TaskStatusToggle";
import { revalidateTag } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getEnterpriseTasks() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3", {
    next: {
      revalidate: 10,
      tags: ["tasks-list"],
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data dari server API");
  }

  return res.json();
}

export default async function TasksPage() {
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

  const tasks = await getEnterpriseTasks();

  const renderTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // console.log("LOG DARI SERVER: komponen ini dieksekusi secara ekslusif di server!");

  // const serverTimestamp = new Date().toLocaleTimeString("id-ID");

  return (
    // <div className="space-y-4 max-w-3xl">
    //   <div className="border-b border-slate-200 pb-4">
    //     <h1 className="text-2xl font-bold text-slate-900">Daftar Pekerjaan</h1>
    //     <p className="text-sm text-slate-500 mt-1">Pilih tugas untuk melihat parameter detail dinamis.</p>
    //   </div>

    //   <div className="space-y-3">
    //     {DUMMY_TASKS.map((task) => (
    //       <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors">
    //         <span className="font-medium text-slate-800 text-sm">{task.title}</span>
    //         <Link href={`/tasks/${task.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
    //           Buka Detail →
    //         </Link>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <div className="space-y-6 max-w-4xl">
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md">STRATEGI: Incremental Static Regeneration (10s)</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Daftar Task Enterprise</h1>
          <p className="text-slate-500 text-sm">File statis diperbarui otomatis di background via Stale-While-Revalidate.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-right">
          <span className="text-xs text-slate-400 block font-medium">Cache Generated At:</span>
          <span className="text-base font-mono font-bold text-purple-600">{renderTime}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
        {tasks.map((task: any) => (
          <div key={task.id} className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">{task.title}</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-600">Active Sync</span>
          </div>
        ))}
      </div>
    </div>
  );
}
