import { TaskDashboardClient } from "@/components/tasks/TaskDashboardClient";
import { AuthTestButtons } from "@/components/AuthTestButtons";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/task";
import { headers, cookies } from "next/headers";
import { getCurrentUserSession } from "@/lib/auth-session";

const fallbackTasks: Task[] = [
  { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true, priority: "HIGH" },
  { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false, priority: "HIGH" },
  { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false, priority: "MEDIUM" },
  { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false, priority: "LOW" },
];

async function getTasks(): Promise<Task[]> {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("access_token")?.value;
  const token = userToken || process.env.INTERNAL_API_KEY || "farhan-secret-key";
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
  const [tasks, session] = await Promise.all([
    getTasks(),
    getCurrentUserSession(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Utama Workspace */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Task Management Studio</h1>
        <p className="text-sm text-slate-500 mt-1">
          Arsitektur terintegrasi Tailwind CSS, CVA, Zustand, dan React Hook Form.
        </p>
      </div>

      {/* Bar Aksi RBAC Deklaratif (Topik 34: Role-Based UI Rendering) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Tugas Tim</h2>
          <p className="text-xs text-slate-500 mt-1">Area manajemen tugas dengan kontrol akses RBAC.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tombol Hapus hanya dirender untuk ADMIN */}
          <RoleGate allowedRoles={["ADMIN"]}>
            <Button size="sm" variant="danger">
              🗑 Hapus Task
            </Button>
          </RoleGate>

          {/* Tombol Edit Proyek dengan fallback informatif untuk non-admin */}
          <RoleGate
            allowedRoles={["ADMIN"]}
            fallback={
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                🔒 View Only Mode
              </span>
            }
          >
            <Button size="sm" variant="primary">
              ✏ Edit Project
            </Button>
          </RoleGate>
        </div>
      </div>

      {/* Konsol Uji Coba: Simulasi Pergantian Peran ADMIN vs USER & Double-Purge Logout */}
      <AuthTestButtons currentSession={session} />

      {/* Tabel & Toolbar Dashboard Tugas */}
      <TaskDashboardClient initialTasks={tasks} />
    </div>
  );
}
