'use server';

import { apiFetch } from "@/lib/api-client";
import { CreateTaskInput, createTaskSchema } from "@/schemas/task-schema";
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
    const message = errorData.message ||
      errorData.error?.message ||
      "Gagal menambah task ke backend Nest.js";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  try {
    (revalidateTag as unknown as (tag: string) => void)("tasks");
  } catch { }
  try {
    revalidatePath("/tasks");
  } catch { }
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
  } catch { }
  try {
    revalidatePath("/tasks");
  } catch { }
}

// 3. Form Action dengan state handler (kompatibel dengan useActionState legacy)
export type FormState = {
  error?: string;
  success?: boolean;
} | null;

// 4. Overload createTaskAction:
// a) Mendukung Bridge Handler Pattern dengan CreateTaskInput (React Hook Form + Zod)
// b) Mendukung legacy signature (prevState, formData)
export async function createTaskAction(data: CreateTaskInput): Promise<{ success: boolean; data?: unknown }>;
export async function createTaskAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState>;
export async function createTaskAction(
  dataOrPrevState: CreateTaskInput | FormState,
  maybeFormData?: FormData
): Promise<{ success: boolean; data?: unknown } | FormState> {
  // Skenario A: Dipanggil via Bridge Handler Pattern dari React Hook Form (CreateTaskInput)
  if (
    dataOrPrevState &&
    typeof dataOrPrevState === "object" &&
    !("error" in dataOrPrevState) &&
    !maybeFormData
  ) {
    const validData = dataOrPrevState as CreateTaskInput;

    // Lapis Kedua: Server-side validation via Zod
    const parsed = createTaskSchema.safeParse(validData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validasi server gagal";
      throw new Error(firstError);
    }

    // Mengirim payload terstruktur ke REST API Nest.js sesuai CreateTaskDto (@IsString, @IsInt)
    const candidateUrls = Array.from(new Set([
      NESTJS_URL,
      "http://localhost:3001",
      "http://localhost:3000",
    ]));

    let res: Response | null = null;
    let lastError: Error | null = null;

    for (const baseUrl of candidateUrls) {
      try {
        const candidateRes = await fetch(`${baseUrl}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
            "x-api-key": API_TOKEN,
          },
          body: JSON.stringify({
            title: parsed.data.title.trim(),
            projectId: Number(parsed.data.projectId),
            ownerId: 9, // Admin user ID di PostgreSQL
          }),
          signal: AbortSignal.timeout(3000),
        });

        if (candidateRes.ok) {
          res = candidateRes;
          break;
        } else {
          const errorData = await candidateRes.json().catch(() => ({}));
          const message =
            errorData.message ||
            errorData.error?.message ||
            "Gagal menambah task ke backend Nest.js";
          lastError = new Error(Array.isArray(message) ? message.join(", ") : message);
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Koneksi gagal");
      }
    }

    if (!res) {
      throw lastError || new Error("Gagal menambah task ke backend Nest.js");
    }

    const createdTask = await res.json();

    try {
      (revalidateTag as unknown as (tag: string) => void)("tasks");
    } catch { }
    try {
      revalidatePath("/tasks");
      revalidatePath("/dashboard/tasks");
    } catch { }

    return { success: true, data: createdTask };
  }

  // Skenario B: Legacy Form Action (prevState, formData)
  const formData = maybeFormData as FormData;
  const title = (formData?.get("title") as string) || "";
  const projectIdRaw = (formData?.get("projectId") as string) || "3";

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

  try {
    (revalidateTag as unknown as (tag: string) => void)("tasks");
  } catch { }
  try {
    revalidatePath("/tasks");
    revalidatePath("/dashboard/tasks");
  } catch { }
  redirect("/tasks");
}