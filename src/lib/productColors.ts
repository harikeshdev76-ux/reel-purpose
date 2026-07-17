export const PRODUCT_COLORS = [
  { value: "WHITE", label: "White", hex: "#FFFFFF" },
  { value: "SAND", label: "Sand", hex: "#C8B89A" },
  { value: "ICE_BLUE", label: "Ice Blue", hex: "#B8D4E8" },
  { value: "SILVER", label: "Silver", hex: "#C0C0C0" },
  { value: "SALMON", label: "Salmon", hex: "#FA8072" },
  { value: "NAVY", label: "Navy", hex: "#1a2c3d" },
  { value: "BLACK", label: "Black", hex: "#1a1a1a" },
  { value: "WHITE_BLUE", label: "White/Blue", hex: "#E8F4FD" },
] as const;

export type ProductColor = (typeof PRODUCT_COLORS)[number];

export const PRODUCT_COLOR_VALUES: string[] = PRODUCT_COLORS.map(
  (c) => c.value,
);

/** Look up a color definition by its stored value/code (e.g. "WHITE"). */
export function getProductColor(value: string): ProductColor | undefined {
  return PRODUCT_COLORS.find((c) => c.value === value);
}

/** Display label for a stored color code, falling back to the raw value. */
export function colorLabel(value: string): string {
  return getProductColor(value)?.label ?? value;
}
