import { ProductType } from "@prisma/client";

/** Display labels for each product type enum value. */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  TSHIRT: "T-Shirt",
  HAT: "Hat",
  ACCESSORY: "Accessory",
};
