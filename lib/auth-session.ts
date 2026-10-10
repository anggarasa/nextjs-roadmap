// lib/auth-session.ts
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export type UserRole = "ADMIN" | "USER" | "MEMBER";

export interface JWTPayload {
  sub: string | number;
  email?: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

/**
 * Membaca cookie access_token dan mengekstrak klaim payload JWT di lingkungan server.
 * Menghasilkan zero network round-trip ke backend Nest.js.
 */
export async function getCurrentUserSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error("[AUTH] Gagal mendecode access_token JWT:", error);
    return null;
  }
}
