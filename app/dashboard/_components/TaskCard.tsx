import Link from "next/link";

export default function TaskCard({ id, title }: { id: string; title: string }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <span className="font-medium text-slate-800 text-sm">{title}</span>
      <Link href={`/dashboard/tasks/${id}`} prefetch={true} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        Lihat Detail →
      </Link>
    </div>
  );
}
