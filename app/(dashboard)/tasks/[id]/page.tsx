interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="max-w-2xl p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
      <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-semibold">ID: {id}</span>
      <h1 className="text-2xl font-bold text-slate-900">Detail Tugas Enterprise</h1>
      <p className="text-slate-600 text-sm leading-relaxed">Data spesifik tugas berhasil ditangkap secara asinkron dari URL. Rute ini siap dihubungkan langsung ke REST API Nest.js backend pada modul mendatang.</p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Arsitektur: React Server Component</span>
        <span>Parameter: Dynamic Segment</span>
      </div>
    </div>
  );
}
