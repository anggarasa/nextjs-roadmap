"use client";

import { CreateTaskForm } from "@/components/CreateTaskForm";
import { createTaskAction } from "@/actions/task-actions";
import type { CreateTaskInput } from "@/schemas/task-schema";

export function NewTaskClient({ projectId = 3 }: { projectId?: number | string }) {
  const handleFormSubmit = async (validData: CreateTaskInput) => {
    try {
      // Mengirim objek terstruktur langsung ke Server Action
      await createTaskAction(validData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan task";
      alert(message);
    }
  };

  return <CreateTaskForm onSubmitAction={handleFormSubmit} defaultProjectId={projectId} />;
}
