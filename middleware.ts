// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Skenario 1: Tamu tanpa token dicegat saat mengakses rute terproteksi
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    console.log(`[EDGE GUARD] Tamu dicegat pada ${pathname} → Redirect ke /login?from=${pathname}`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Skenario 2: User aktif dicegat saat membuka kembali halaman auth
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    console.log(`[EDGE GUARD] User aktif mengakses ${pathname} → Reverse redirect ke /dashboard/tasks`);
    return NextResponse.redirect(new URL("/dashboard/tasks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
