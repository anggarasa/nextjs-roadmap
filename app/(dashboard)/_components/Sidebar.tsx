"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard Utama",
    href: "/dashboard",
  },
  {
    label: "Daftar Task",
    href: "/dashboard/tasks",
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        // Mengecek apakah rute sedang aktif
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
