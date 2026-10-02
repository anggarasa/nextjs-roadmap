interface TaskDetailProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailProps) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Detail Task #{id}</h1>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">Active Segment</span>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Ini adalah tampilan detail untuk task dengan identifikasi unik: <code className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono font-bold">{id}</code>
        </p>
        <p className="text-xs text-slate-400">Rute ini dirender otomatis di sisi server berdasarkan parameter URL.</p>
      </div>
    </div>
  );
}
