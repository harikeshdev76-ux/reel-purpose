import { ProductCategory, ProductType, Size, Species } from "@prisma/client";

export type ProductInput = {
  name: string;
  description: string;
  species: Species;
  type: ProductType;
  category: ProductCategory;
  price: number; // cents
  sizes: Size[];
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
    typeof b.species !== "string" ||
    !Object.values(Species).includes(b.species as Species)
  ) {
    throw new Error("Invalid species");
  }
  const species = b.species as Species;

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
    imageUrl,
    featured: Boolean(b.featured),
    active: b.active === undefined ? true : Boolean(b.active),
    inStock: b.inStock === undefined ? true : Boolean(b.inStock),
  };
}
