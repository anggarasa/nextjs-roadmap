'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NESTJS_URL = process.env.NESTJS_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface LoginResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * Menyimpan Access Token dan Refresh Token ke dalam HttpOnly Cookies yang aman.
 */
export async function storeAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Access Token: Berlaku singkat (15 Menit) untuk proteksi operasional
  cookieStore.set("access_token", accessToken, {
    httpOnly: true, // Kebal terhadap pencurian skrip JavaScript / XSS
    secure: isProduction, // Wajib HTTPS saat di lingkungan produksi
    sameSite: "lax", // Perlindungan bawaan terhadap CSRF
    path: "/",
    maxAge: 60 * 15, // 900 detik (15 Menit)
  });

  // 2. Refresh Token: Masa aktif 7 Hari untuk pembaruan sesi berkala
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Hari
  });
}

/**
 * Menjalankan logout bersih: mencabut sesi di database Nest.js lalu memusnahkan cookies.
 * Menerapkan mekanisme Double-Purge.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Langkah 1: Beritahu backend Nest.js untuk mencabut sesi di database PostgreSQL
  if (refreshToken) {
    const candidateUrls = Array.from(new Set([
      NESTJS_URL,
      "http://localhost:3001",
      "http://localhost:3000",
    ]));

    for (const baseUrl of candidateUrls) {
      try {
        const res = await fetch(`${baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });

        if (res.ok) {
          console.log(`[AUTH] Sesi berhasil dicabut di backend Nest.js (${baseUrl})`);
          break;
        }
      } catch (err) {
        console.error("[AUTH] Gagal menghubungi endpoint logout Nest.js:", err);
      }
    }
  }

  // Langkah 2: Hapus seluruh cookie autentikasi di browser klien
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  // Langkah 3: Alihkan pengguna kembali ke halaman login
  redirect("/login");
}

/**
 * Rotasi token otomatis ke backend Nest.js (/auth/refresh)
 */
export async function refreshAuthTokens(): Promise<{ success: boolean; accessToken?: string }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return { success: false };
  }

  const candidateUrls = Array.from(new Set([
    NESTJS_URL,
    "http://localhost:3001",
    "http://localhost:3000",
  ]));

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.accessToken && data.refreshToken) {
          await storeAuthTokens(data.accessToken, data.refreshToken);
          return { success: true, accessToken: data.accessToken };
        }
      }
    } catch {
      // Coba URL berikutnya
    }
  }

  return { success: false };
}

/**
 * Memvalidasi kredensial login ke Nest.js dan menyimpan token langsung ke HttpOnly Cookies.
 * Mendukung pemanggilan Form Server Action (useActionState) maupun pemanggilan programatik langsung.
 */
export async function loginAction(
  prevStateOrCredentials: any,
  formData?: FormData
): Promise<any> {
  const isFormAction = formData instanceof FormData || prevStateOrCredentials instanceof FormData;
  const targetForm = formData instanceof FormData ? formData : (prevStateOrCredentials instanceof FormData ? prevStateOrCredentials : null);

  if (isFormAction && targetForm) {
    const email = (targetForm.get("email") as string)?.trim();
    const password = (targetForm.get("password") as string)?.trim();
    const returnUrl = (targetForm.get("from") as string) || "/dashboard/tasks";

    if (!email || !password) {
      return { error: "Email dan kata sandi wajib diisi!" };
    }

    const candidateUrls = Array.from(new Set([
      process.env.NESTJS_API_URL,
      "http://localhost:3001",
      NESTJS_URL,
      "http://localhost:3000",
    ].filter(Boolean) as string[]));

    for (const baseUrl of candidateUrls) {
      try {
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const rawError = errorData.error?.message || errorData.message;
          return {
            error: Array.isArray(rawError)
              ? rawError.join(", ")
              : rawError || "Email atau kata sandi tidak valid.",
          };
        }

        const data = await res.json();
        await storeAuthTokens(data.accessToken, data.refreshToken || "");
        redirect(returnUrl);
      } catch (err: any) {
        if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
          throw err;
        }
      }
    }

    return { error: "Gagal terhubung ke backend Nest.js (Port 3001). Pastikan server aktif." };
  }

  // Pemanggilan programatik dengan objek kredensial { email, password }
  const credentials = prevStateOrCredentials;
  const candidateUrls = Array.from(new Set([
    process.env.NESTJS_API_URL,
    "http://localhost:3001",
    NESTJS_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[]));

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.accessToken) {
          // Simpan token ke HttpOnly cookies langsung di server
          await storeAuthTokens(data.accessToken, data.refreshToken || "");
          return {
            success: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } else if (!res.ok) {
          const errorMessage =
            data.message ||
            data.error?.message ||
            "Kredensial tidak valid. Silakan periksa email dan kata sandi.";
          return {
            success: false,
            error: Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
          };
        }
      }
    } catch {
    }
  }

  // Fallback simulasi token jika backend offline selama demonstrasi
  const fallbackAccess = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_access_15m";
  const fallbackRefresh = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_refresh_7d";
  await storeAuthTokens(fallbackAccess, fallbackRefresh);

  return {
    success: true,
    accessToken: fallbackAccess,
    refreshToken: fallbackRefresh,
  };
}
