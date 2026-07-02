import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/requireCustomer";

export async function PUT(req: Request) {
  const user = await requireCustomer();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };

  const address = {
    line1: (body.line1 ?? "").trim(),
    city: (body.city ?? "").trim(),
    state: (body.state ?? "").trim(),
    zip: (body.zip ?? "").trim(),
  };

  await prisma.customer.update({
    where: { email: user.email },
    data: { address },
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await requireCustomer();
  if (!user) {
    return NextResponse.json({ address: null });
  }

  const customer = await prisma.customer.findUnique({
    where: { email: user.email },
    select: { address: true },
  });

  return NextResponse.json({ address: customer?.address ?? null });
}
