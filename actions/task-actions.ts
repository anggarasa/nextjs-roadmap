'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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
  const description = (formData.get("description") as string) || "";
  const projectIdRaw = (formData.get("projectId") as string) || "3";

  if (!title || title.trim().length === 0) {
    return {
      error: "Judul tugas wajib diisi!"
    }
  }

  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const projectId = parseInt(projectIdRaw, 10) || 3;

  try {
    const res = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        Authorization: `Bearer ${token}`,
        'x-api-key': token
      },
      body: JSON.stringify({
        title: title.trim(),
        projectId: projectId,
        ownerId: 9
      })
    })

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      console.error("Gagal menyimpan tugas ke backend:", errorJson);
      const errorMsg = errorJson?.error?.message
        ? (Array.isArray(errorJson.error.message) ? errorJson.error.message.join(", ") : errorJson.error.message)
        : "Gagal menyimpan tugas ke backend Nest.js";
      return { error: errorMsg };
    }
  } catch (err) {
    console.error("Network Error", err);
    return { error: "Tidak dapat terhubung ke server backend Nest.js" }
  }

  (revalidateTag as unknown as (tag: string, profile?: unknown) => void)('tasks');
  revalidatePath("/tasks");
  redirect('/tasks');


}