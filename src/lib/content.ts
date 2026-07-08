import { prisma } from "@/lib/prisma";

/** Fetch the given SiteContent keys as a { key: value } map. */
export async function getContent(
  keys: string[],
): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: keys } },
  });
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

/**
 * Accessor with a fallback. Always pass the current hardcoded value as the
 * fallback so pages render identically even if a key is missing/unseeded.
 */
export function c(
  content: Record<string, string>,
  key: string,
  fallback = "",
): string {
  return content[key] ?? fallback;
}
