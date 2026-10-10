"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskSearchBar } from "@/components/TaskSearchBar";
import { StatusFilterBadge } from "@/components/StatusFilterBadge";
import { TaskTableFiltered } from "@/components/tasks/TaskTableFiltered";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { Button } from "@/components/ui/Button";
import { createTaskAction } from "@/actions/task-actions";
import type { CreateTaskInput } from "@/schemas/task-schema";
import type { Task } from "@/types/task";

export function TaskDashboardClient({ initialTasks }: { initialTasks: Task[] | any[] }) {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Sinkronkan state lokal saat RSC initialTasks diperbarui dari server (dengan deduplikasi)
  useEffect(() => {
    setTasks((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(initialTasks)) {
        return prev;
      }
      return initialTasks;
    });
  }, [initialTasks]);

  const handleCreateTask = async (data: CreateTaskInput) => {
    try {
      const res = await createTaskAction(data);
      if (res && "data" in res && res.data) {
        setTasks((prev) => [res.data, ...prev]);
      } else {
        const newTask = {
          id: Date.now(),
          title: data.title,
          description: data.description,
          priority: data.priority || "MEDIUM",
          status: "OPEN",
          done: false,
        };
        setTasks((prev) => [newTask, ...prev]);
      }
      router.refresh();
    } catch {
      // Fallback lokal agar interaksi demo tetap mulus jika backend belum menyala
      const newTask = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: "OPEN",
        done: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar Atas: Search Bar, Status Filter, dan Tombol Tambah Task */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <TaskSearchBar />
          <StatusFilterBadge />
        </div>
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          ＋ Tambah Task
        </Button>
      </div>

      {/* Tabel Tugas Reaktif Terfilter */}
      <TaskTableFiltered tasks={tasks} />

      {/* Modal Form Dialog */}
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateTask} defaultProjectId={3} />
    </div>
  );
}
