import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-400 mb-8">TaskManager Pro</h2>
        <nav className="space-y-2">
          <Link href="/tasks" className="block px-3 py-2 rounded-lg bg-slate-800 text-sm font-medium">
            📋 Kelola Task
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
