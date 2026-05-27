import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const session = request.cookies.get("fluxion_session");
  const isLoggedIn = Boolean(session && session.value === "active");

  // Always allow access to the login page (even if already logged in).
  if (pathname === "/admin/login") return NextResponse.next();

  // Protect all other /admin routes.
  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    // Preserve where the user wanted to go, so login can redirect back.
    loginUrl.searchParams.set("next", `${pathname}${search ?? ""}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
