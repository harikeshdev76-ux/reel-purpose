/** Shape stored in Order.shippingAddress (Json). Mirrors Stripe address fields. */
export type ShippingAddress = {
  name?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

/** Render a shipping address as display lines, skipping empty parts. */
export function formatAddressLines(
  address: ShippingAddress | null | undefined,
): string[] {
  if (!address) return [];
  const lines: string[] = [];
  if (address.name) lines.push(address.name);
  if (address.line1) lines.push(address.line1);
  if (address.line2) lines.push(address.line2);
  const cityLine = [address.city, address.state, address.zip]
    .filter(Boolean)
    .join(", ");
  if (cityLine) lines.push(cityLine);
  if (address.country) lines.push(address.country);
  return lines;
}
