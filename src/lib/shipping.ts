// Pure shipping helpers — safe to import from client and server. The live fee
// is stored in the CMS (settings.shipping.fee, as a dollar amount); read it
// server-side via getShippingFee() in "@/lib/shippingFee".
export const DEFAULT_SHIPPING_FEE_CENTS = 599; // $5.99 flat shipping & handling
