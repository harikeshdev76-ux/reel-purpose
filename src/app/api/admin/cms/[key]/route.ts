import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";

export async function PUT(
  req: Request,
  { params }: { params: { key: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { value?: string };
  const value = body.value;
  if (typeof value !== "string" || value.trim() === "") {
    return NextResponse.json(
      { error: "Value cannot be empty." },
      { status: 400 },
    );
  }

  // Upsert — update the value; create as a safety net if the key is missing.
  await prisma.siteContent.upsert({
    where: { key: params.key },
    update: { value },
    create: {
      key: params.key,
      value,
      label: params.key,
      section: "Uncategorized",
    },
  });

  return NextResponse.json({ success: true });
}
