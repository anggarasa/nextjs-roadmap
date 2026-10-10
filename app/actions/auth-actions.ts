"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  storeAuthTokens as _storeAuthTokens,
  logoutAction as _logoutAction,
  refreshAuthTokens as _refreshAuthTokens,
  simulateLoginRole as _simulateLoginRole,
} from "@/actions/auth-actions";

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Ekstraksi input dari FormData
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const returnUrl = (formData.get("from") as string) || "/dashboard/tasks";

  // 2. Validasi awal di server
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi!" };
  }

  // 3. Eksekusi panggilan intra-server ke backend Nest.js
  const candidateUrls = Array.from(
    new Set([
      process.env.NESTJS_API_URL,
      "http://localhost:3001",
      "http://localhost:3000",
    ].filter(Boolean) as string[])
  );

  let res: Response | null = null;
  for (const baseUrl of candidateUrls) {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        res = response;
        break;
      }
    } catch {
      // Coba port backend berikutnya jika port pertama tidak merespon
    }
  }

  if (!res) {
    return {
      error: "Gagal terhubung ke backend Nest.js (Port 3001). Pastikan server backend aktif.",
    };
  }

  // 4. Tangani respons gagal dari AllExceptionsFilter Nest.js
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const rawError = errorData.error?.message || errorData.message;
    return {
      error: Array.isArray(rawError)
        ? rawError.join(", ")
        : rawError || "Email atau kata sandi tidak valid.",
    };
  }

  // 5. Ekstraksi payload token hasil verifikasi
  const data = await res.json();
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // Simpan Access Token ke HttpOnly Cookie (15 Menit)
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  // Simpan Refresh Token ke HttpOnly Cookie (7 Hari)
  cookieStore.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 6. Alihkan pengguna ke URL tujuan awal atau dashboard
  redirect(returnUrl);
}

/**
 * Menyimpan Access Token dan Refresh Token ke dalam HttpOnly Cookies yang aman.
 */
export async function storeAuthTokens(accessToken: string, refreshToken: string) {
  return _storeAuthTokens(accessToken, refreshToken);
}

/**
 * Menjalankan logout bersih: mencabut sesi di database Nest.js lalu memusnahkan cookies.
 */
export async function logoutAction() {
  return _logoutAction();
}

/**
 * Rotasi token otomatis ke backend Nest.js (/auth/refresh)
 */
export async function refreshAuthTokens() {
  return _refreshAuthTokens();
}

/**
 * Simulasi pergantian role pengguna untuk pengujian RBAC (Topik 34).
 */
export async function simulateLoginRole(role: "ADMIN" | "USER") {
  return _simulateLoginRole(role);
}
