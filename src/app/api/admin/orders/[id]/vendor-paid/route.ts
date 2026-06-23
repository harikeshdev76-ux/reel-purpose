import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.order.update({
    where: { id: params.id },
    data: { vendorPaid: true },
  });
  return NextResponse.json({ success: true });
}
