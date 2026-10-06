import Link from "next/link";

export default function DashboardLayout({ children, analytics, metrics }: { children: React.ReactNode; analytics: React.ReactNode; metrics: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Konten Halaman Utama Dashboard */}
      <div>{children}</div>

      {/* Area Parallel Slots: Dua Kolom Berdampingan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>{analytics}</div>
        <div>{metrics}</div>
      </div>
    </div>
  );
}
