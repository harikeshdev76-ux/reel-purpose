// Pure tax math — safe to import from client and server. The live rate is
// stored in the CMS; read it server-side via getTaxRate() in "@/lib/taxRate".
export const DEFAULT_TAX_RATE = 0.07; // 6% state + 1% county surtax

export function calculateTax(subtotalCents: number, rate: number): number {
  return Math.round(subtotalCents * rate);
}

export function calculateTotal(
  subtotalCents: number,
  rate: number,
): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const tax = calculateTax(subtotalCents, rate);
  return {
    subtotal: subtotalCents,
    tax,
    total: subtotalCents + tax,
  };
}
