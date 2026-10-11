import { TaskDashboardClient } from "@/components/tasks/TaskDashboardClient";
import { AuthTestButtons } from "@/components/AuthTestButtons";
import { EnvSecurityBadge } from "@/components/EnvSecurityBadge";
import { VercelDeploymentBadge } from "@/components/VercelDeploymentBadge";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/task";
import { headers, cookies } from "next/headers";
import { getCurrentUserSession } from "@/lib/auth-session";
import { UserAvatar } from "@/components/UserAvatar";
import { ProjectBanner } from "@/components/ProjectBanner";
import { env } from "@/lib/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Tugas",
  description: "Sistem manajemen tugas dan kolaborasi tim terintegrasi penuh dengan Nest.js API & Prisma.",
};

const fallbackTasks: Task[] = [
  { id: 1, title: "Setup Docker Container & Redis Cache", description: "Infrastruktur container untuk caching enterprise", status: "DONE", done: true, priority: "HIGH" },
  { id: 2, title: "Integrasi REST API Nest.js Backend", description: "Menghubungkan endpoint backend dengan PostgreSQL", status: "IN_PROGRESS", done: false, priority: "HIGH" },
  { id: 3, title: "Implementasi Client State dengan Zustand", description: "Optimasi render isolation & atomic selectors", status: "OPEN", done: false, priority: "MEDIUM" },
  { id: 4, title: "Optimasi Form Handling dengan React Hook Form", description: "Validasi form ketat berbasis skema Zod", status: "OPEN", done: false, priority: "LOW" },
];

async function getTasks(): Promise<Task[]> {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("access_token")?.value;
  const token = userToken || env.JWT_ACCESS_SECRET;

  try {
    // Pemanggilan dinamis dan aman berbasis environment stage (Topik 41: Fail-Fast Type-Safe ENV)
    const res = await fetch(`${env.NEST_API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": env.JWT_ACCESS_SECRET,
        "x-internal-backend-call": "true",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });

    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Backend offline / timeout saat demo: gunakan fallbackTasks
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
      {/* Banner Proyek Responsif (Topik 35: Fluid Responsive Fill dengan next/image) */}
      <ProjectBanner
        bannerUrl="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1600&auto=format&fit=crop"
        title="Sprint & Task Management Studio"
      />

      {/* Header Utama Workspace dengan UserAvatar Fixed Sizing & Tipografi font-sans */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <UserAvatar
            src="https://avatars.githubusercontent.com/u/9919?v=4"
            name={session?.email ? session.email.split("@")[0] : "Farhan Coders"}
          />
          <div>
            <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
              Task Management Dashboard
            </h1>
            <p className="text-sm font-sans text-slate-500 mt-1">
              Tipografi teroptimasi otomatis via Next.js Font Engine.
            </p>
          </div>
        </div>
      </div>

      {/* Kartu data dengan badge berfont-mono (Topik 36: Pembuktian next/font) */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-semibold font-sans text-slate-800">
            Migrasi Skema Prisma & Nest.js API
          </h3>
          <p className="text-xs font-sans text-slate-400">
            Pembaruan DTO dan integrasi relasi task.
          </p>
        </div>

        {/* UUID dan status teknis wajib menggunakan font monospace */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            TASK-UUID: 8f4a1c2b
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            ● DONE
          </span>
        </div>
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

      {/* Inspeksi Arsitektur Vercel Cloud & Edge Deployment (Topik 42) */}
      <VercelDeploymentBadge
        serverData={{
          isVercel: Boolean(process.env.VERCEL || env.VERCEL),
          vercelEnv:
            process.env.VERCEL_ENV ||
            env.VERCEL_ENV ||
            (env.NODE_ENV === "production" ? "production" : "development"),
          vercelRegion:
            process.env.VERCEL_REGION || env.VERCEL_REGION || "sin1 (Singapore)",
          nestApiUrl: env.NEST_API_URL,
          appUrl: env.NEXT_PUBLIC_APP_URL,
          nodeEnv: env.NODE_ENV,
        }}
      />

      {/* Inspeksi Security Boundary Client vs Server (Topik 41) */}
      <EnvSecurityBadge />

      {/* Konsol Uji Coba: Simulasi Pergantian Peran ADMIN vs USER & Double-Purge Logout */}
      <AuthTestButtons currentSession={session} />

      {/* Tabel & Toolbar Dashboard Tugas */}
      <TaskDashboardClient initialTasks={tasks} />
    </div>
  );
}
