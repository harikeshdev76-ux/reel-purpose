import { ProductCategory } from "@prisma/client";

/** Full display labels — used in the admin product form dropdown. */
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  ORIGINALS: "Reel Purpose Originals",
  SALTWATER: "Saltwater",
  FRESHWATER: "Freshwater",
};

/** Short labels — used in the admin table and shop filter pills. */
export const PRODUCT_CATEGORY_SHORT: Record<ProductCategory, string> = {
  ORIGINALS: "Originals",
  SALTWATER: "Saltwater",
  FRESHWATER: "Freshwater",
};
