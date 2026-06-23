/** Format a price in cents as a USD string, e.g. 3800 → "$38", 3850 → "$38.50". */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** Format cents as a fixed two-decimal USD string, e.g. 3800 → "$38.00". */
export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
