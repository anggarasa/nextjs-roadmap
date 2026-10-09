export default function TaskLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse max-w-5xl mx-auto">
      {/* Skeleton Header Halaman: Menjaga dimensi dan letak header */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          {/* Badge skeleton */}
          <div className="h-5 bg-purple-100 rounded-md w-48"></div>
          {/* Judul skeleton */}
          <div className="h-7 bg-slate-200 rounded-lg w-64"></div>
          {/* Deskripsi skeleton */}
          <div className="h-4 bg-slate-100 rounded w-80"></div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="h-10 bg-slate-100 rounded-lg w-32"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-36"></div>
          <div className="h-10 bg-emerald-100 rounded-lg w-36"></div>
        </div>
      </div>

      {/* Skeleton Kartu Tugas: 4 Baris Placeholder identik dengan kartu nyata */}
      <div className="grid gap-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="space-y-2 w-3/4">
              <div className="flex items-center gap-2">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-blue-100 rounded w-12"></div>
              </div>
              <div className="h-3.5 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div className="h-8 bg-slate-100 rounded-lg w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
