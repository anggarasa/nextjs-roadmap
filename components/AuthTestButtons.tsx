"use client";

import { storeAuthTokens, logoutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export function AuthTestButtons() {
  const [isSettingToken, setIsSettingToken] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSimulateLogin = async () => {
    setIsSettingToken(true);
    setStatusMessage(null);
    try {
      // Simulasi payload token JWT dari respon Nest.js
      const dummyAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_access_15m";
      const dummyRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_refresh_7d";

      await storeAuthTokens(dummyAccessToken, dummyRefreshToken);
      setStatusMessage("Token JWT berhasil disimpan ke dalam HttpOnly Cookies!");
      alert("Token JWT berhasil disimpan ke dalam HttpOnly Cookies!");
    } catch (err) {
      console.error("Gagal menyimpan token:", err);
      alert("Terjadi kesalahan saat menyimpan token.");
    } finally {
      setIsSettingToken(false);
    }
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>🛡️</span>
            <span>Konsol Pengujian Keamanan JWT (Topik 32)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulasi penyimpanan Dual-Token di HttpOnly Cookies & pengujian Double-Purge Logout.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            HttpOnly: True (Anti-XSS)
          </span>
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
            SameSite: Lax
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSimulateLogin}
          disabled={isSettingToken}
        >
          {isSettingToken ? "Menyimpan Token..." : "🔑 Simulasi Set Token JWT"}
        </Button>

        <form action={logoutAction}>
          <Button variant="danger" size="sm" type="submit">
            🚪 Logout Sesi (Double-Purge)
          </Button>
        </form>
      </div>

      {statusMessage && (
        <div className="text-xs text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <span>✅</span>
          <span>{statusMessage} (Periksa tab Application &gt; Cookies pada DevTools browser)</span>
        </div>
      )}
    </div>
  );
}
