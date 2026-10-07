async function getAnalyticsData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    totalResolved: 842,
    efficiencyRate: "96.4%",
    activeSprintVelocity: "48 Pts",
  };
}

export async function HeavyTaskMetrics() {
  const metrics = await getAnalyticsData();

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Analitik Metrik Performa</h3>
        <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">Heavy Data Streamed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Tugas Diselesaikan</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalResolved}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Tingkat Efisiensi</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{metrics.efficiencyRate}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Kecepatan Sprint</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">{metrics.activeSprintVelocity}</p>
        </div>
      </div>
    </div>
  );
}
