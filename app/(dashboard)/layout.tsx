import { DashboardUIProvider } from "@/context/DashboardUIContext";
import { Sidebar } from "@/components/Sidebar";
import { HeaderToggle } from "@/components/HeaderToggle";
import { getCurrentUserSession } from "@/lib/auth-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserSession();

  return (
    <DashboardUIProvider>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar Klien Konsumen Context */}
        <Sidebar />

        {/* Area Konten Utama */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <HeaderToggle />
              <span className="text-sm font-semibold text-slate-700">Workspace Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <span
                  className={`text-xs px-2.5 py-1 border rounded-full font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  Role: {user.role}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                RSC Composition Active
              </span>
            </div>
          </header>

          <main className="p-8 flex-1 overflow-auto">
            {/* Slot Children: Tetap berstatus Server Component */}
            {children}
          </main>
        </div>
      </div>
    </DashboardUIProvider>
  );
}
