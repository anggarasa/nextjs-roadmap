"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface DashboardUIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DashboardUIContext = createContext<DashboardUIState | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return <DashboardUIContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>{children}</DashboardUIContext.Provider>;
}

export function useDashboardUI() {
  const context = useContext(DashboardUIContext);
  if (!context) {
    throw new Error("useDashboardUI wajib dipanggil di dalam hierarki <DashboardUIProvider>");
  }
  return context;
}
