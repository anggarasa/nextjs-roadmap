"use client";

import { logoutAction, simulateLoginRole } from "@/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import type { JWTPayload } from "@/lib/auth-session";

interface AuthTestButtonsProps {
  currentSession?: JWTPayload | null;
}

export function AuthTestButtons({ currentSession }: AuthTestButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeRole, setActiveRole] = useState<string | null>(currentSession?.role || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveRole(currentSession?.role || null);
  }, [currentSession]);

  const handleSwitchRole = (role: "ADMIN" | "USER") => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        await simulateLoginRole(role);
        setActiveRole(role);
        setStatusMessage(`Role berhasil dialihkan ke ${role}! Token JWT disimpan ke HttpOnly Cookies.`);
        router.refresh();
      } catch (err) {
        console.error("Gagal mengalihkan role:", err);
      }
    });
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>🛡️</span>
            <span>Konsol Pengujian RBAC & Keamanan JWT (Topik 34)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Uji coba pergantian peran ADMIN vs USER secara langsung untuk mengamati unmounting DOM pada RoleGate.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500">Sesi Aktif:</span>
            <span
              className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                activeRole === "ADMIN"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : activeRole === "USER" || activeRole === "MEMBER"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {activeRole ? activeRole : "Tamu (Belum Login)"}
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            Zero Round-Trip Decode
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={activeRole === "ADMIN" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleSwitchRole("ADMIN")}
          disabled={isPending}
        >
          👑 Login Sbg ADMIN
        </Button>

        <Button
          variant={activeRole === "USER" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleSwitchRole("USER")}
          disabled={isPending}
        >
          👤 Login Sbg USER
        </Button>

        <form action={logoutAction}>
          <Button variant="danger" size="sm" type="submit" disabled={isPending}>
            🚪 Logout Sesi (Double-Purge)
          </Button>
        </form>
      </div>

      {statusMessage && (
        <div className="text-xs text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <span>✅</span>
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
