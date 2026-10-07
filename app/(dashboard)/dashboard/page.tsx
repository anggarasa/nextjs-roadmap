import { HeavyTaskMetrics } from "@/components/HeavyTaskMetrics";
import { MetricsSkeleton } from "@/components/MetricsSkeleton";
import { Suspense } from "react";

async function QuickTaskList() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-3">Tugas Prioritas Hari Ini</h2>
      <ul className="space-y-2 text-sm text-slate-700">
        <li className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
          <span>✓ Setup Docker Container & Redis Cache</span>
          <span className="text-xs text-emerald-600 font-semibold">Ready</span>
        </li>
        <li className="p-2.5 bg-slate-50 rounded-lg flex justify-between">
          <span>⚙ Integrasi REST API Nest.js Backend</span>
          <span className="text-xs text-blue-600 font-semibold">In Review</span>
        </li>
      </ul>
    </div>
  );
}

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Task Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Halaman ini menggunakan Granular Suspense Boundaries untuk HTTP Chunked Streaming.</p>
      </div>

      {/* 1. Dirender instan tanpa tertahan */}
      <QuickTaskList />

      {/* 2. Komponen berat diisolasi secara mandiri */}
      <Suspense fallback={<MetricsSkeleton />}>
        <HeavyTaskMetrics />
      </Suspense>
    </div>
  );
}
