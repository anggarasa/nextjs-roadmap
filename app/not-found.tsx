import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
          404 NOT FOUND
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-900">
          Tugas Tidak Ditemukan
        </h2>
        <p className="text-sm font-sans text-slate-600">
          Data tugas yang Anda cari tidak tersedia di sistem atau telah dihapus.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
