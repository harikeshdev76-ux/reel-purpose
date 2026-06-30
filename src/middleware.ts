import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role-based protection for the two private surfaces. /admin/* requires an
// admin-role session; /vendor/* requires a vendor-role session. The login pages
// (/admin and /vendor exactly) are NOT matched below, so they stay public.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });
  const role = token?.role;

  if (pathname.startsWith("/vendor")) {
    if (role !== "vendor") {
      return NextResponse.redirect(new URL("/vendor", req.url));
    }
  } else if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/products/:path*",
    "/admin/orders/:path*",
    "/admin/vendors/:path*",
    "/admin/tax/:path*",
    "/admin/settings/:path*",
    "/vendor/dashboard/:path*",
    "/vendor/orders/:path*",
    "/vendor/products/:path*",
  ],
};
