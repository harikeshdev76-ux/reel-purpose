import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

type EditProductProps = { params: { id: string } };

export async function generateMetadata({
  params,
}: EditProductProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  return {
    title: product
      ? `Edit ${product.name} · Admin`
      : "Edit Product · Admin",
  };
}

export default async function EditProductPage({ params }: EditProductProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!product) notFound();

  return <ProductForm product={product} />;
}
