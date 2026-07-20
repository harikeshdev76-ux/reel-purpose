import { NextResponse } from "next/server";
import { getTaxRate } from "@/lib/taxRate";
import { getShippingFee } from "@/lib/shippingFee";

export const dynamic = "force-dynamic";

// Public checkout config used by the cart: live tax rate + shipping fee (cents).
export async function GET() {
  const [rate, shippingFee] = await Promise.all([
    getTaxRate(),
    getShippingFee(),
  ]);
  const percentage = `${parseFloat((rate * 100).toFixed(2))}%`;
  return NextResponse.json({ rate, percentage, shippingFee });
}
