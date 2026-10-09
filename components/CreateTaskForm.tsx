"use client";

import { createTaskAction, FormState } from "@/actions/task-actions";
import { useActionState } from "react";
import { SubmitButton } from "./SubmitButton";

export function CreateTaskForm({ projectId = "3" }: { projectId?: string | number }) {
  const [state, formAction] = useActionState(createTaskAction, null as FormState);

  return (
    <form action={formAction} className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Buat Tugas Baru</h2>
        <p className="text-xs text-slate-500 mt-1">Form submission native terintegrasi ke Nest.js API.</p>
      </div>

      {/* Menampilkan pesan error validasi jika ada */}
      {state?.error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium animate-in fade-in">⚠️ {state.error}</div>}

      {/* Input hidden untuk mengirim Project ID */}
      <input type="hidden" name="projectId" value={String(projectId)} />

      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1">
          Judul Task *
        </label>
        <input id="title" name="title" placeholder="Contoh: Implementasi Auth Guard Nest.js" className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 transition" />
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
          Deskripsi Tambahan
        </label>
        <textarea id="description" name="description" rows={3} placeholder="Detail pekerjaan atau kriteria penerimaan..." className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 transition" />
      </div>

      {/* Tombol submit reaktif */}
      <SubmitButton />
    </form>
  );
}
