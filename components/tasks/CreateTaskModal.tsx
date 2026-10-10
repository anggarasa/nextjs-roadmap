"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "@/schemas/task-schema";
import { Button } from "@/components/ui/Button";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskInput) => Promise<void>;
  defaultProjectId?: string | number;
}

export function CreateTaskModal({ isOpen, onClose, onSave, defaultProjectId = 3 }: CreateTaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: Number(defaultProjectId),
      priority: "MEDIUM",
      description: "",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateTaskInput) => {
    try {
      await onSave(data);
      reset({
        title: "",
        projectId: Number(defaultProjectId),
        priority: "MEDIUM",
        description: "",
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan task";
      alert(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 scale-100 transition-transform">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Tambah Tugas Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register("projectId", { valueAsNumber: true })} />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Tugas *</label>
            <input {...register("title")} placeholder="Contoh: Implementasi UI Task Manager..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
            <textarea {...register("description")} rows={3} placeholder="Rincian scope pekerjaan..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas *</label>
            <select {...register("priority")} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="LOW">Rendah (LOW)</option>
              <option value="MEDIUM">Sedang (MEDIUM)</option>
              <option value="HIGH">Tinggi (HIGH)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
