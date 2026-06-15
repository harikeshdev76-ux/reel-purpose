import { ProductType, Species } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop All Gear · Reel Purpose",
  description: "Florida fishing apparel — filter by species and type.",
};

type ShopPageProps = {
  searchParams: { species?: string; type?: string };
};

function parseEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string | undefined,
): T[keyof T] | null {
  if (value && (Object.values(enumObj) as string[]).includes(value)) {
    return value as T[keyof T];
  }
  return null;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const species = parseEnum(Species, searchParams.species);
  const type = parseEnum(ProductType, searchParams.type);

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(species ? { species } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <ProductGrid
      products={products}
      selectedSpecies={species}
      selectedType={type}
    />
  );
}
