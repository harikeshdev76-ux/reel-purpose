import { NextResponse } from "next/server";
import { getTaxRate } from "@/lib/taxRate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rate = await getTaxRate();
  const percentage = `${parseFloat((rate * 100).toFixed(2))}%`;
  return NextResponse.json({ rate, percentage });
}
