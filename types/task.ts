export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  done: boolean;
  projectId: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
}