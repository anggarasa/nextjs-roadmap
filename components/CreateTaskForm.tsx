// components/CreateTaskForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "@/schemas/task-schema";

interface CreateTaskFormProps {
  onSubmitAction: (data: CreateTaskInput) => Promise<void>;
  defaultProjectId?: number | string;
}

export function CreateTaskForm({
  onSubmitAction,
  defaultProjectId = 3, // ID Project Nest.js default (contoh: 3 = 'NestJS course')
}: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: Number(defaultProjectId),
      description: "",
    },
  });

  const handleFormSubmit = async (data: CreateTaskInput) => {
    await onSubmitAction(data);
    reset({
      title: "",
      projectId: Number(defaultProjectId),
      description: "",
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-lg mx-auto">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Form Tugas Baru</h3>
        <p className="text-xs text-slate-500 mt-0.5">Tervalidasi deklaratif via Zod & React Hook Form (Selaras Nest.js DTO).</p>
      </div>

      {/* Input Hidden untuk Project ID */}
      <input type="hidden" {...register("projectId")} />
      {errors.projectId && <p className="text-red-500 text-xs">{errors.projectId.message}</p>}

      {/* Kolom Judul Task */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pekerjaan *</label>
        <input
          {...register("title")}
          placeholder="Contoh: Implementasi Zod Validator..."
          className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition focus:outline-none focus:ring-2 ${errors.title ? "border-red-300 focus:ring-red-400 bg-red-50/30" : "border-slate-200 focus:ring-blue-500"}`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.title.message}</p>}
      </div>

      {/* Kolom Deskripsi Task (Opsional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi (Opsional)</label>
        <textarea {...register("description")} rows={3} placeholder="Rincian scope pekerjaan..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
      </div>

      {/* Tombol Submit dengan Status Pending */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menyimpan ke Backend...</span>
          </>
        ) : (
          "Simpan & Tambah Task"
        )}
      </button>
    </form>
  );
}
