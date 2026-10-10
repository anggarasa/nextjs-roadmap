import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Judul tugas minimal 3 karakter")
    .max(100, "Judul tugas maksimal 100 karakter"),
  projectId: z.coerce
    .number({ invalid_type_error: "Project ID harus berupa angka valid" })
    .int("Project ID harus berupa bilangan bulat")
    .positive("Project ID tidak valid"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

// Inferensi tipe data otomatis untuk TypeScript
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
