'use server';

import { apiFetch } from "@/lib/api-client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const NESTJS_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_TOKEN = process.env.INTERNAL_API_KEY || "farhan-secret-key";

// 1. Mutasi Create Task via Progressive Enhancement Form Action (formData langsung)
export async function createTask(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const projectIdRaw = (formData.get("projectId") as string) || "3";
  const projectId = parseInt(projectIdRaw, 10) || 3;

  if (!title || title.length < 3) {
    throw new Error("Judul tugas minimal harus 3 karakter.");
  }

  const res = await fetch(`${NESTJS_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      "x-api-key": API_TOKEN,
    },
    body: JSON.stringify({
      title,
      projectId,
      ownerId: 9, // Sub ID Admin di PostgreSQL
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.message ||
      errorData.error?.message ||
      "Gagal menambah task ke backend Nest.js";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  try {
    (revalidateTag as unknown as (tag: string) => void)("tasks");
  } catch {}
  revalidatePath("/tasks");
}

// 2. Mutasi Update Status Task (Siklus Status via useTransition)
export async function updateTaskStatus(taskId: string | number, done: boolean) {
  const res = await fetch(`${NESTJS_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      "x-api-key": API_TOKEN,
    },
    body: JSON.stringify({
      done,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.message ||
      errorData.error?.message ||
      "Gagal memperbarui status task di backend Nest.js";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  try {
    (revalidateTag as unknown as (tag: string) => void)("tasks");
  } catch {}
  revalidatePath("/tasks");
}

// 3. Form Action dengan state handler (kompatibel dengan useActionState di CreateTaskForm)
export type FormState = {
  error?: string;
  success?: boolean;
} | null;

export async function createTaskAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = (formData.get("title") as string) || "";
  const projectIdRaw = (formData.get("projectId") as string) || "3";

  if (!title || title.trim().length === 0) {
    return {
      error: "Judul tugas wajib diisi!",
    };
  }
  const projectId = parseInt(projectIdRaw, 10) || 3;

  try {
    await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        projectId: projectId,
        ownerId: 9,
      }),
    });
  } catch (err) {
    console.error("Network Error", err);
    return { error: "Tidak dapat terhubung ke server backend Nest.js" };
  }

  (revalidateTag as unknown as (tag: string) => void)("tasks");
  revalidatePath("/tasks");
  redirect("/tasks");
}