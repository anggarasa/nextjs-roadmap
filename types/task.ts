export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string | number;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  done?: boolean;
  projectId?: string | number;
  assignedToId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}