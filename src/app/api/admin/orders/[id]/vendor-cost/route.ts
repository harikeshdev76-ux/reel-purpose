import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { vendorCost?: number };
  const vendorCost = body.vendorCost;

  // vendorCost is stored in cents; accept a non-negative integer.
  if (
    typeof vendorCost !== "number" ||
    !Number.isFinite(vendorCost) ||
    vendorCost < 0
  ) {
    return NextResponse.json({ error: "Invalid vendor cost" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: params.id },
    data: { vendorCost: Math.round(vendorCost) },
  });
  return NextResponse.json({ success: true });
}
