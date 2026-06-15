export const FL_TAX_RATE = 0.07; // 6% state + 1% county surtax

export function calculateTax(subtotalCents: number): number {
  return Math.round(subtotalCents * FL_TAX_RATE);
}

export function calculateTotal(subtotalCents: number): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const tax = calculateTax(subtotalCents);
  return {
    subtotal: subtotalCents,
    tax,
    total: subtotalCents + tax,
  };
}
