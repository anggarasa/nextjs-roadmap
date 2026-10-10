"use client";

import { useDashboardUI } from "@/context/DashboardUIContext";
import Link from "next/link";

export function Sidebar() {
  const { isSidebarCollapsed } = useDashboardUI();

  return (
    <aside className={`transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-100 flex items-center px-4 overflow-hidden">
        <div className="font-bold text-blue-600 text-lg tracking-tight whitespace-nowrap">{isSidebarCollapsed ? "TM" : "TaskManager Pro"}</div>
      </div>

      {/* Navigasi Menu */}
      <nav className="p-3 space-y-1.5 flex-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
          <span className="text-base">📊</span>
          {!isSidebarCollapsed && <span className="whitespace-nowrap">Ringkasan</span>}
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
          <span className="text-base">📋</span>
          {!isSidebarCollapsed && <span className="whitespace-nowrap">Daftar Task</span>}
        </Link>
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono overflow-hidden whitespace-nowrap">{isSidebarCollapsed ? "v1.0" : "Enterprise v1.0"}</div>
    </aside>
  );
}
