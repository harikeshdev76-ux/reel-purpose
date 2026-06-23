import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

/**
 * Build a unique product slug from a name. If the base slug is taken, append
 * -2, -3, … until free. `excludeId` lets an update keep its own slug.
 */
export async function uniqueProductSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let n = 1;
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}
