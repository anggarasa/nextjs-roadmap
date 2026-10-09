import Link from "next/link";
import SidebarNav from "./_components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigasi Persisten */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-xl">
        <div className="text-xl font-bold tracking-tight text-blue-400 mb-8">TaskManager Pro</div>

        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            📊 Ringkasan
          </Link>
          <Link href="/tasks" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            📋 Kelola Pekerjaan
          </Link>
          <Link href="/projects/proj-enterprise-01" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            📁 Detail Project (Parallel)
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-400">Modul 02: Enterprise Routing</div>
      </aside>

      {/* Konten Utama Dinamis */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
          <span className="text-sm font-semibold text-slate-700">Workspace Aktif</span>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Production Setup</span>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
