import { prisma } from "@/lib/prisma";
import { DEFAULT_TAX_RATE } from "@/lib/tax";

/**
 * Read the live sales-tax rate from the CMS (settings.tax.rate). Falls back to
 * the default and clamps to [0, 0.2] to guard against bad data. Server-only
 * (uses prisma) — do not import from client components.
 */
export async function getTaxRate(): Promise<number> {
  const row = await prisma.siteContent.findUnique({
    where: { key: "settings.tax.rate" },
  });
  const rate = parseFloat(row?.value ?? String(DEFAULT_TAX_RATE));
  if (Number.isNaN(rate)) return DEFAULT_TAX_RATE;
  return Math.min(Math.max(rate, 0), 0.2);
}
