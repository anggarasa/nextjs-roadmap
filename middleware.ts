import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ekstraksi cookie autentikasi di Edge Runtime secara sinkron
  const token = request.cookies.get("access_token")?.value;

  // 2. Membaca pathname rute yang diminta pengguna
  const { pathname } = request.nextUrl;

  console.log(`[EDGE MIDDLEWARE] Mencegat request ke: ${pathname} | Token ada: ${Boolean(token)}`);

  // 3. Evaluasi guard keamanan rute terproteksi
  if (!token && pathname.startsWith("/dashboard")) {
    console.log(`[EDGE MIDDLEWARE] Akses ditolak! Mengalihkan ke /login...`);
    // Redirect langsung ke halaman login sebelum menyentuh Server Component
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Lanjutkan perjalanan request jika kondisi aman
  return NextResponse.next();
}

// 5. Konfigurasi Matcher: Hanya targetkan seluruh rute di bawah /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
