// app/(auth)/login/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Memverifikasi Akun...</span>
        </>
      ) : (
        "Masuk ke Dashboard"
      )}
    </button>
  );
}

interface LoginFormProps {
  initialFrom?: string;
}

export function LoginForm({ initialFrom }: LoginFormProps = {}) {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || initialFrom;
  const returnUrl = fromParam || "/dashboard/tasks";
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form
      action={formAction}
      className="space-y-4 max-w-sm mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900">Masuk Akun Enterprise</h2>
        <p className="text-xs text-slate-500 mt-1">Gunakan akun Nest.js terdaftar.</p>
        {fromParam && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
            🔒 Autentikasi diperlukan untuk melanjutkan ke tujuan.
          </p>
        )}
      </div>

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium animate-in fade-in">
          ⚠️ {state.error}
        </div>
      )}

      {/* Kirim URL tujuan awal via input hidden */}
      <input type="hidden" name="from" value={returnUrl} />

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="admin@farhancoders.dev"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
