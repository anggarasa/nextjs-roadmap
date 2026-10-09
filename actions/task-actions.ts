'use server';

import { apiFetch } from "@/lib/api-client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTaskStatus(taskId: string | number, status: string) {

  const isDone = status === "DONE";

  await apiFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ done: isDone }),
  });

  (revalidateTag as unknown as (tag: string, profile?: unknown) => void)("tasks");
}

export type FormState = {
  error?: string;
  success?: boolean;
} | null;

export async function createTaskAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Ekstraksi data secara native dari FormData
  const title = (formData.get("title") as string) || "";
  const projectIdRaw = (formData.get("projectId") as string) || "3";

  if (!title || title.trim().length === 0) {
    return {
      error: "Judul tugas wajib diisi!"
    }
  }
  const projectId = parseInt(projectIdRaw, 10) || 3;

  try {
    await apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: title.trim(),
        projectId: projectId,
        ownerId: 9
      })
    });
  } catch (err) {
    console.error("Network Error", err);
    return { error: "Tidak dapat terhubung ke server backend Nest.js" }
  }

  (revalidateTag as unknown as (tag: string, profile?: unknown) => void)('tasks');
  revalidatePath("/tasks");
  redirect('/tasks');


}