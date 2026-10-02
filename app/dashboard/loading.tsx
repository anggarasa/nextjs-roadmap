export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-full"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}
