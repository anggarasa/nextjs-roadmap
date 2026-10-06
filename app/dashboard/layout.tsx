import Link from "next/link";

export default function DashboardLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="p-8 flex-1">{children}</main>

      {/* Slot paralel untuk merender modal jika rute dicegat */}
      {modal}
    </div>
  );
}
