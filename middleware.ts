import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Deklarasi segmen rute yang dilindungi dan rute otentikasi
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // 2. Ekstraksi token sesi dari HTTP-only cookie
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Evaluasi kecocokan rute
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Skenario 1: Tamu tanpa token mencoba masuk ke area privat
  if (isProtected && !token) {
    console.log(`[EDGE GUARD] Tamu dicegat pada ${pathname} → Redirect ke /login?from=${pathname}`);
    const loginUrl = new URL("/login", request.url);
    // Preservasi rute awal agar pengguna dapat dikembalikan setelah login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Skenario 2: Pengguna yang sudah login mencoba membuka kembali halaman auth
  if (isAuthRoute && token) {
    console.log(`[EDGE GUARD] User aktif mengakses ${pathname} → Reverse redirect ke /dashboard/tasks`);
    // Balikkan pengguna langsung ke workspace utama dashboard
    return NextResponse.redirect(new URL("/dashboard/tasks", request.url));
  }

  // Loloskan request yang valid atau aset publik
  return NextResponse.next();
}

// 3. Konfigurasi Matcher: Kecualikan file statis, gambar, dan favicon
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
