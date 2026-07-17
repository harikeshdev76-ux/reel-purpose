import { ProductCategory, ProductType, Size, Species } from "@prisma/client";
import { PRODUCT_COLOR_VALUES } from "@/lib/productColors";

export type ProductInput = {
  name: string;
  description: string;
  species: Species | null;
  type: ProductType;
  category: ProductCategory;
  price: number; // cents
  sizes: Size[];
  colors: string[];
  imageUrl: string;
  featured: boolean;
  active: boolean;
  inStock: boolean;
};

/**
 * Validate and normalize a product create/update payload.
 * Throws an Error with a human-readable message on invalid input.
 */
export function parseProductInput(body: unknown): ProductInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) throw new Error("Name is required");

  const description =
    typeof b.description === "string" ? b.description.trim() : "";
  if (!description) throw new Error("Description is required");

  if (
    typeof b.type !== "string" ||
    !Object.values(ProductType).includes(b.type as ProductType)
  ) {
    throw new Error("Invalid product type");
  }
  const type = b.type as ProductType;

  // Category defaults to ORIGINALS when missing or invalid.
  const category =
    typeof b.category === "string" &&
    Object.values(ProductCategory).includes(b.category as ProductCategory)
      ? (b.category as ProductCategory)
      : ProductCategory.ORIGINALS;

  // Species is required for SALTWATER/FRESHWATER, optional (null) for ORIGINALS.
  const parsedSpecies =
    typeof b.species === "string" &&
    Object.values(Species).includes(b.species as Species)
      ? (b.species as Species)
      : null;
  if (category !== ProductCategory.ORIGINALS && !parsedSpecies) {
    throw new Error("Species is required for this collection.");
  }
  const species = parsedSpecies;

  if (
    typeof b.price !== "number" ||
    !Number.isFinite(b.price) ||
    b.price < 0
  ) {
    throw new Error("Invalid price");
  }
  const price = Math.round(b.price);

  if (!Array.isArray(b.sizes)) throw new Error("Invalid sizes");
  const sizes = b.sizes.filter(
    (s): s is Size =>
      typeof s === "string" && Object.values(Size).includes(s as Size),
  );

  const colors = Array.isArray(b.colors)
    ? b.colors.filter(
        (col): col is string =>
          typeof col === "string" && PRODUCT_COLOR_VALUES.includes(col),
      )
    : [];

  const imageUrl = typeof b.imageUrl === "string" ? b.imageUrl.trim() : "";
  if (!imageUrl) throw new Error("Image is required");

  return {
    name,
    description,
    species,
    type,
    category,
    price,
    sizes,
    colors,
    imageUrl,
    featured: Boolean(b.featured),
    active: b.active === undefined ? true : Boolean(b.active),
    inStock: b.inStock === undefined ? true : Boolean(b.inStock),
  };
}
