import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns true when the current request has an authenticated admin session. */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}
