import { prisma } from "@/lib/prisma";
import { DEFAULT_SHIPPING_FEE_CENTS } from "@/lib/shipping";

/**
 * Read the live shipping & handling fee (in cents) from the CMS
 * (settings.shipping.fee, stored as a dollar amount, e.g. "5.99"). Falls back
 * to the default and clamps to [0, $100] to guard against bad data. Server-only
 * (uses prisma) — do not import from client components.
 */
export async function getShippingFee(): Promise<number> {
  const row = await prisma.siteContent.findUnique({
    where: { key: "settings.shipping.fee" },
  });
  if (!row) return DEFAULT_SHIPPING_FEE_CENTS;
  const dollars = parseFloat(row.value);
  if (Number.isNaN(dollars)) return DEFAULT_SHIPPING_FEE_CENTS;
  const cents = Math.round(dollars * 100);
  return Math.min(Math.max(cents, 0), 10000);
}
