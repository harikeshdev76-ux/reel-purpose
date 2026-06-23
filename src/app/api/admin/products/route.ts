import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";
import { parseProductInput } from "@/lib/productInput";
import { uniqueProductSlug } from "@/lib/productSlug";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input;
  try {
    input = parseProductInput(await req.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const slug = await uniqueProductSlug(input.name);
  const product = await prisma.product.create({ data: { ...input, slug } });

  return NextResponse.json({ product });
}
