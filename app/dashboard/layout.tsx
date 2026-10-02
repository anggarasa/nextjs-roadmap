import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar Persistent */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">TaskMaster Pro</h2>
        <nav className="space-y-3">
          <Link href="/dashboard" className="block text-slate-300 hover:text-white">
            Dashboard Utama
          </Link>
          <Link href="/dashboard/tasks" className="block text-slate-300 hover:text-white">
            Kelola Task
          </Link>
        </nav>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Enterprise Workspace</span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
