import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/requireCustomer";

export async function PUT(req: Request) {
  const user = await requireCustomer();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    phone?: string;
  };
  const name = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  const phone = (body.phone ?? "").trim() || null;

  await prisma.customer.update({
    where: { email: user.email },
    data: { name, phone },
  });

  return NextResponse.json({ success: true });
}
