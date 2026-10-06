export default async function analyticsSlot() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">Analitik Aktivitas Tim</h3>
        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-semibold">Realtime</span>
      </div>
      <div className="h-32 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">[ Area Visualisasi Grafik Task Selesai ]</div>
      <p className="mt-3 text-xs text-slate-500">Pembaruan otomatis data sprint mingguan.</p>
    </div>
  );
}
