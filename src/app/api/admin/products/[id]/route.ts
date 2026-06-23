import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/requireAdmin";
import { parseProductInput } from "@/lib/productInput";
import { uniqueProductSlug } from "@/lib/productSlug";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let input;
  try {
    input = parseProductInput(await req.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Regenerate the slug only when the name changed.
  const slug =
    input.name === existing.name
      ? existing.slug
      : await uniqueProductSlug(input.name, existing.id);

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { ...input, slug },
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft delete — preserve order history by deactivating instead of removing.
  await prisma.product.update({
    where: { id: params.id },
    data: { active: false },
  });

  return NextResponse.json({ success: true });
}
