import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionVendor } from "@/lib/requireVendor";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const vendor = await getSessionVendor();
  if (!vendor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { status?: string };
  const status = body.status as OrderStatus | undefined;
  if (!status || !Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  // A vendor may only update orders assigned to them.
  if (order.vendorId !== vendor.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.order.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json({ success: true });
}
