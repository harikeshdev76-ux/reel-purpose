import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SPECIES_LABELS } from "@/lib/species";
import { formatPrice } from "@/lib/money";
import AddToCartSection from "@/components/shop/AddToCartSection";

type ProductPageProps = { params: { slug: string } };

function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product
      ? `${product.name} · Reel Purpose`
      : "Product · Reel Purpose",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product || !product.active) notFound();

  const speciesLabel = SPECIES_LABELS[product.species];

  return (
    <div className="bg-brand-base">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="font-condensed text-sm uppercase tracking-widest text-brand-textMuted">
          <Link href="/" className="transition-colors hover:text-brand-textPrimary">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link
            href="/shop"
            className="transition-colors hover:text-brand-textPrimary"
          >
            Shop
          </Link>
          <span className="mx-2">›</span>
          <span className="text-brand-textPrimary">{product.name}</span>
        </nav>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row">
          {/* Image */}
          <div className="lg:flex-1">
            <div className="relative aspect-square bg-black/10">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <span className="absolute left-4 top-4 bg-brand-sectionGreen px-3 py-1 font-condensed text-xs uppercase tracking-widest text-brand-textOnDark">
                {speciesLabel}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:flex-1">
            <p className="font-condensed text-sm uppercase tracking-widest text-brand-rust">
              {speciesLabel}
            </p>
            <h1 className="mt-2 font-display text-[48px] leading-[0.95] text-brand-textPrimary">
              {product.name}
            </h1>
            <p className="mt-3 font-display text-2xl text-brand-rust">
              {formatPrice(product.price)}
            </p>
            <p className="mt-5 max-w-prose font-body text-brand-textMuted">
              {product.description}
            </p>

            <AddToCartSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
