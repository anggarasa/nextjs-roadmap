// app/actions/auth-actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NESTJS_URL = process.env.NESTJS_API_URL || "http://localhost:3001";

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const returnUrl = (formData.get("from") as string) || "/dashboard/tasks";

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi!" };
  }

  // 1. Panggilan intra-server ke backend Nest.js
  let res: Response;
  try {
    res = await fetch(`${NESTJS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return {
      error: "Gagal terhubung ke backend Nest.js (Port 3001). Pastikan server backend aktif.",
    };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawError = err.message || err.error?.message || "Email atau kata sandi tidak valid.";
    return {
      error: Array.isArray(rawError)
        ? rawError.join(", ")
        : rawError || "Email atau kata sandi tidak valid.",
    };
  }

  const data = await res.json();
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // 2. Kunci Access Token (15 Menit) ke HttpOnly Cookie
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  // 3. Kunci Refresh Token (7 Hari) ke HttpOnly Cookie
  cookieStore.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(returnUrl);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Revokasi record sesi di database Nest.js
  if (refreshToken) {
    await fetch(`${NESTJS_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => {});
  }

  // Double-purge: Musnahkan cookies sesi di browser
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  redirect("/login");
}

/**
 * Menyimpan Access Token dan Refresh Token ke dalam HttpOnly Cookies yang aman.
 */
export async function storeAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
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

  try {
    const res = await fetch(`${NESTJS_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.accessToken && data.refreshToken) {
        await storeAuthTokens(data.accessToken, data.refreshToken);
        return { success: true, accessToken: data.accessToken };
      }
    }
  } catch {
    // fallback
  }

  return { success: false };
}

/**
 * Simulasi pergantian role pengguna untuk pengujian RBAC (Topik 34).
 */
export async function simulateLoginRole(role: "ADMIN" | "USER") {
  const isUser = role === "USER";
  const accessToken = isUser
    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InVzZXJAZmFyaGFuY29kZXJzLmRldiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzkxNDczNjMzLCJleHAiOjIxMDY4MzM2MzN9.mock_signature"
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoiYWRtaW5AZmFyaGFuY29kZXJzLmRldiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc5MTQ3MzYzMywiZXhwIjoyMTA2ODMzNjMzfQ.mock_signature";
  const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh.mock_signature";

  await storeAuthTokens(accessToken, refreshToken);
  return { success: true, role };
}
