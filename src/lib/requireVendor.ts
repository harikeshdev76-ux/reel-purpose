import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** True when the current request has an authenticated vendor session. */
export async function isVendor(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "vendor";
}

/** The Vendor record for the current vendor session, or null if not a vendor. */
export async function getSessionVendor() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "vendor" || !session.user.email) return null;
  return prisma.vendor.findUnique({ where: { email: session.user.email } });
}
