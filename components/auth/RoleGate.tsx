// components/auth/RoleGate.tsx
import React from "react";
import { getCurrentUserSession, type UserRole } from "@/lib/auth-session";

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server Component deklaratif untuk merender elemen antarmuka
 * secara bersyarat berdasarkan peran (role) pengguna.
 */
export async function RoleGate({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  // Ekstraksi sesi pengguna langsung di server Next.js
  const user = await getCurrentUserSession();

  // Jika sesi tidak ditemukan atau peran pengguna tidak memenuhi syarat
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Jika peran valid, render children secara utuh
  return <>{children}</>;
}
