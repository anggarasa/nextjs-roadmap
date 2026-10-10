"use client";

import { useDashboardUI } from "@/context/DashboardUIContext";

export function HeaderToggle() {
  const { toggleSidebar, isSidebarCollapsed } = useDashboardUI();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 active:scale-95 transition-all text-slate-700 text-sm font-medium flex items-center gap-2 cursor-pointer"
      aria-label="Toggle Navigation Sidebar"
    >
      <span>☰</span>
      <span className="text-xs hidden sm:inline">{isSidebarCollapsed ? "Perluas Menu" : "Kecilkan Menu"}</span>
    </button>
  );
}
