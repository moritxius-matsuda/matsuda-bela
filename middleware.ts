import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const ALLOWED_ROLES = ["admin", "console", "jcwsmp"];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/console")) {
    const { userId, sessionClaims } = getAuth(request);

    if (!userId) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Quick & dirty: sessionClaims als any casten, damit TypeScript nicht meckert
    const claims = sessionClaims as any;
    const role = claims?.publicMetadata?.role || claims?.role;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/no-access", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/console/:path*"],
};
