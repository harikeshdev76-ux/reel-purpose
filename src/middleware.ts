import { withAuth } from "next-auth/middleware";

// Protects the admin panel routes. The /admin login page itself is intentionally
// NOT matched below, so it stays publicly reachable. Authorization requires an
// admin-role token; anything else is redirected to the sign-in page (/admin).
export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
  pages: {
    signIn: "/admin",
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/products/:path*",
    "/admin/orders/:path*",
    "/admin/vendors/:path*",
    "/admin/tax/:path*",
  ],
};
