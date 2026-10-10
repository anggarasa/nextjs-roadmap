"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/actions/auth-actions";

interface LoginFormProps {
  initialFrom?: string;
}

export function LoginForm({ initialFrom }: LoginFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Membaca URL tujuan awal dari parameter 'from' atau fallback ke default dashboard
  const fromParam = searchParams.get("from") || initialFrom;
  const returnUrl = fromParam || "/dashboard/tasks";

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim() || "admin@farhancoders.dev";
    const password = (formData.get("password") as string)?.trim() || "password123";

    try {
      // Integrasi autentikasi: Hubungkan ke backend Nest.js /auth/login (HttpOnly Cookies diatur di server)
      const result = await loginAction({ email, password });

      if (!result.success) {
        setErrorMessage(result.error || "Gagal masuk aplikasi.");
        setLoading(false);
        return;
      }

      // 1. Arahkan pengguna kembali ke halaman yang mereka minta sebelum terlempar
      router.push(returnUrl);

      // 2. Memicu sinkronisasi data Server Components dan revalidasi sesi
      router.refresh();
    } catch (err) {
      console.error("Gagal login:", err);
      router.push(returnUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Masuk Akun Enterprise</h2>
        <p className="text-xs text-slate-500 mt-0.5">Sesi Anda belum terautentikasi atau telah berakhir.</p>

        {fromParam && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl mt-3 border border-amber-200">
            🔒 Sesi diperlukan untuk mengakses: <span className="font-mono font-semibold">{returnUrl}</span>
          </p>
        )}

        {errorMessage && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mt-3 border border-red-200">⚠️ {errorMessage}</p>}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Karyawan</label>
          <input type="email" name="email" defaultValue="admin@farhancoders.dev" className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
          <input type="password" name="password" defaultValue="password123" className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm">
        {loading ? "Memverifikasi Kredensial..." : "Masuk Aplikasi"}
      </button>

      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-700 text-center">
        💡 <strong>Mode Edge Guard:</strong> Akses rute otomatis divalidasi oleh Edge Middleware Two-Way Redirection.
      </div>
    </form>
  );
}
