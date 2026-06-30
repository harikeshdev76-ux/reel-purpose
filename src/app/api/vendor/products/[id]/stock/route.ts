import { NextResponse } from "next/server";
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

  const body = (await req.json()) as { inStock?: unknown };
  if (typeof body.inStock !== "boolean") {
    return NextResponse.json({ error: "Invalid inStock value" }, { status: 400 });
  }

  // Single shared inventory: any vendor may toggle any product's stock.
  await prisma.product.update({
    where: { id: params.id },
    data: { inStock: body.inStock },
  });
  return NextResponse.json({ success: true });
}
