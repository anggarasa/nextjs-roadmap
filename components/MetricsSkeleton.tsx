export function MetricsSkeleton() {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="h-5 bg-slate-100 rounded-full w-28"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-20 bg-slate-100 rounded-lg"></div>
        <div className="h-20 bg-slate-100 rounded-lg"></div>
        <div className="h-20 bg-slate-100 rounded-lg"></div>
      </div>
    </div>
  );
}
