import { TaskDashboardClient } from "@/components/tasks/TaskDashboardClient";
import { Task } from "@/types/task";

const fallbackTasks: Task[] = [
  { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true, priority: "HIGH" },
  { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false, priority: "HIGH" },
  { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false, priority: "MEDIUM" },
  { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false, priority: "LOW" },
];

async function getTasks(): Promise<Task[]> {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const candidateUrls = [process.env.NESTJS_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", "http://localhost:3000", "http://localhost:3001"];

  const uniqueUrls = Array.from(new Set(candidateUrls));

  for (const baseUrl of uniqueUrls) {
    try {
      const res = await fetch(`${baseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": token,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });

      const contentType = res.headers.get("content-type") || "";
      // Cegah infinite loop jika URL menunjuk ke Next.js (yang mengembalikan text/html)
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Backend di port ini belum siap / timeout, coba URL berikutnya
    }
  }

  return fallbackTasks;
}

export default async function TasksPage() {
  console.log("[SERVER COMPONENT] Rendering TasksPage on server...");
  const tasks = await getTasks();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Task Management Studio</h1>
        <p className="text-sm text-slate-500 mt-1">Arsitektur terintegrasi Tailwind CSS, CVA, Zustand, dan React Hook Form.</p>
      </div>

      <TaskDashboardClient initialTasks={tasks} />
    </div>
  );
}
