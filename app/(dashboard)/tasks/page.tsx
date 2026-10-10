import { TaskDashboardClient } from "@/components/tasks/TaskDashboardClient";
import { AuthTestButtons } from "@/components/AuthTestButtons";
import { Task } from "@/types/task";
import { headers } from "next/headers";

const fallbackTasks: Task[] = [
  { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true, priority: "HIGH" },
  { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false, priority: "HIGH" },
  { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false, priority: "MEDIUM" },
  { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false, priority: "LOW" },
];

async function getTasks(): Promise<Task[]> {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const backendUrl = process.env.NESTJS_API_URL || "http://localhost:3001";

  // Hanya arahkan ke backend Nest.js (hindari fetch ke Next.js sendiri untuk mencegah infinite loop)
  const candidateUrls = Array.from(
    new Set([
      backendUrl,
      "http://localhost:3001",
    ].filter(Boolean) as string[])
  );

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": token,
          "x-internal-backend-call": "true",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      });

      const contentType = res.headers.get("content-type") || "";
      // Pastikan respons benar-benar JSON dari backend Nest.js
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Backend di port ini belum siap / timeout
    }
  }

  return fallbackTasks;
}

export default async function TasksPage() {
  const headerList = await headers();
  // Cegah recursive rendering jika request internal tidak sengaja mengarah ke Next.js
  if (headerList.get("x-internal-backend-call")) {
    return null;
  }

  console.log("[SERVER COMPONENT] Rendering TasksPage on server...");
  const tasks = await getTasks();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Task Management Studio</h1>
        <p className="text-sm text-slate-500 mt-1">Arsitektur terintegrasi Tailwind CSS, CVA, Zustand, dan React Hook Form.</p>
      </div>

      {/* Konsol Uji Coba: Simulasi Penyimpanan Token & Double-Purge Logout */}
      <AuthTestButtons />

      <TaskDashboardClient initialTasks={tasks} />
    </div>
  );
}
