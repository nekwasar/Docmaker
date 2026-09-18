import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Edge-safe: only checks a session *exists* (custom jose cookie or NextAuth JWT).
// Admin *role* is enforced in app/admin/layout.tsx + lib/admin.ts (needs DB,
// which Edge middleware cannot query). Unauthenticated → /signup.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const customSession = req.cookies.get("session")?.value;
  const nextAuthToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!customSession && !nextAuthToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/signup";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (customSession) {
    try {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || "docmaker-secret-key-change-in-production"
      );
      await jwtVerify(customSession, secret);
      return NextResponse.next();
    } catch {
      // Invalid custom token — fall through to allow NextAuth cookie check below.
      if (nextAuthToken) return NextResponse.next();
      const url = req.nextUrl.clone();
      url.pathname = "/signup";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
