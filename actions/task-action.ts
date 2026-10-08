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