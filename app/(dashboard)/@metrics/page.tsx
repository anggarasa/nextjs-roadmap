// app/dashboard/@metrics/page.tsx
export default async function MetricsSlot() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">Metrik KPI Engineering</h3>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-semibold">KPI Bulan Ini</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Total Task</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">128</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Deployment Sukses</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">99.4%</p>
        </div>
      </div>
    </div>
  );
}
