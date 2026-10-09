import { CreateTaskForm } from "@/components/CreateTaskForm";
import Link from "next/link";

export default function CreateTaskPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/tasks" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition">
          ← Kembali ke Kelola Pekerjaan
        </Link>
        <span className="text-xs font-mono px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium">React 19 Form Action</span>
      </div>

      <CreateTaskForm projectId="3" />
    </div>
  );
}
