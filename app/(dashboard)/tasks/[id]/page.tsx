export const dynamicParams = false;

export async function generateStaticParams() {
  const taskIds = ["task-101", "task-102", "task-103"];

  return taskIds.map((id) => ({
    id: id,
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    // <div className="max-w-2xl p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
    //   <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-semibold">ID: {id}</span>
    //   <h1 className="text-2xl font-bold text-slate-900">Detail Tugas Enterprise</h1>
    //   <p className="text-slate-600 text-sm leading-relaxed">Data spesifik tugas berhasil ditangkap secara asinkron dari URL. Rute ini siap dihubungkan langsung ke REST API Nest.js backend pada modul mendatang.</p>

    //   <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
    //     <span>Arsitektur: React Server Component</span>
    //     <span>Parameter: Dynamic Segment</span>
    //   </div>
    // </div>

    <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">STRATEGI: SSG (Pre-Rendered)</span>
        <span className="text-xs text-slate-400 font-mono">ID: {id}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">Spesifikasi Pekerjaan #{id}</h1>
      <p className="text-sm text-slate-600 leading-relaxed">Halaman ini dikompilasi menjadi dokumen HTML statis saat proses build berlangsung. Akses ke halaman ini bebas dari latensi kueri runtime database.</p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Distribusi: Edge CDN Ready</span>
        <span>Runtime Compute: 0 ms</span>
      </div>
    </div>
  );
}
