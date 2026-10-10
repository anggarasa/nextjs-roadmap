import { Task } from "@/types/task";

export const initialFallbackTasks: Task[] = [
  {
    id: 1,
    title: "Setup Docker Container & Redis Cache",
    description: "Infrastruktur container untuk caching enterprise",
    status: "DONE",
    done: true,
  },
  {
    id: 2,
    title: "Integrasi REST API Nest.js Backend",
    description: "Menghubungkan endpoint backend dengan PostgreSQL",
    status: "IN_PROGRESS",
    done: false,
  },
  {
    id: 3,
    title: "Implementasi Client State dengan Zustand",
    description: "Optimasi render isolation & atomic selectors",
    status: "OPEN",
    done: false,
  },
  {
    id: 4,
    title: "Optimasi Form Handling dengan React Hook Form",
    description: "Validasi form ketat berbasis skema Zod",
    status: "OPEN",
    done: false,
  },
];

// In-memory array yang persisten di runtime Node.js dev server
const dynamicTasks: Task[] = [...initialFallbackTasks];

export function getFallbackTasks(): Task[] {
  return dynamicTasks;
}

export function addFallbackTask(task: Omit<Task, "id">): Task {
  const newTask: Task = {
    ...task,
    id: Date.now(),
  };
  dynamicTasks.unshift(newTask);
  return newTask;
}
