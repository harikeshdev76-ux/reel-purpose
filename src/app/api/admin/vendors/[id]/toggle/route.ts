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

  const vendor = await prisma.vendor.findUnique({ where: { id: params.id } });
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const updated = await prisma.vendor.update({
    where: { id: params.id },
    data: { active: !vendor.active },
  });

  return NextResponse.json({ success: true, active: updated.active });
}
