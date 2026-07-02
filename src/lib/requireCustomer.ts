import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type CustomerSessionUser = {
  name?: string | null;
  email: string;
  role: string;
};

/**
 * Returns the authenticated customer's session user, or null if the request is
 * not an authenticated customer. Route handlers should return a 401 when null.
 * Mirrors the inline getServerSession + role check used by admin routes.
 */
export async function requireCustomer(): Promise<CustomerSessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "customer" || !session.user?.email) {
    return null;
  }
  return {
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}
