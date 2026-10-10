import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'DONE';

interface TaskFileter {
  search: string;
  status: TaskStatus;
  setSearch: (search: string) => void
  setStatus: (status: TaskStatus) => void;
  resetFilter: () => void
}

export const useTaskFilterStore = create<TaskFileter>()(
  persist(
    (set) => ({
      search: "",
      status: "ALL",
      setSearch: (search) => set({ search }),
      setStatus: (status) => set({ status }),
      resetFilter: () => set({ search: "", status: "ALL" })
    }),
    {
      name: "dashboard-task-filters",
    }
  )
);