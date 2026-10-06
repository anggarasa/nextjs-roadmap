import Link from "next/link";
import SidebarNav from "./_components/Sidebar";

export default function DashboardLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block shrink-0">
        <h2 className="text-xl font-bold text-blue-400 mb-8">TaskManager Pro</h2>
        <SidebarNav />
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 flex-1">{children}</main>
      </div>

      {/* Slot paralel untuk merender modal jika rute dicegat */}
      {modal}
    </div>
  );
}
