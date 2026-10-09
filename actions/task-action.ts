'use server';

import { revalidatePath, revalidateTag } from "next/cache";

export async function updateTaskStatus(taskId: string | number, status: string) {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const isDone = status === "DONE";

  const res = await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": token
    },
    body: JSON.stringify({ done: isDone }),
  })

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gagal mengubah data di backend: ", errorText);
    throw new Error("Gagal memperbarui status task di backend Nest.js")
  }

  (revalidateTag as unknown as (tag: string, profile?: unknown) => void)("tasks");
}

interface CreateTaskInput {
  title: string;
  projectId?: string | number;
  ownerId?: string | number;
}

export async function createTaskAction(data: CreateTaskInput) {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const payload = {
    title: data.title,
    projectId: data.projectId ?? 1,
    ownerId: data.ownerId ?? 9
  }

  const res = await fetch(`${apiUrl}/tasks`, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      Authorization: `Bearer ${token}`,
      'x-api-key': token
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gagal membuat task di backend:", errorText);
    throw new Error("Gagal membuat tugas baru di Nest.js API backend")
  }

  const newTask = await res.json();

  revalidatePath('/tasks');
  (revalidateTag as unknown as (tag: string, profile?: unknown) => void)('tasks');

  return newTask;
}