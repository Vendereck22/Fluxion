import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const legacySession = request.cookies.get("fluxion_session");
  const authSession =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");
  const isLoggedIn = Boolean(
    legacySession?.value === "active" || authSession?.value
  );


  if (pathname === "/admin/login") return NextResponse.next();


  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);

    loginUrl.searchParams.set("next", `${pathname}${search ?? ""}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
