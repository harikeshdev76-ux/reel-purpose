import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SPECIES_LABELS } from "@/lib/species";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/productCategory";
import { formatPrice } from "@/lib/money";
import AddToCartSection from "@/components/shop/AddToCartSection";
import { getContent, c } from "@/lib/content";

type ProductPageProps = { params: { slug: string } };

const PRODUCT_BLURB =
  "Whether you're casting inshore, running offshore, or relaxing at the dock, every Reel Purpose product is built with comfort, durability, and performance in mind.";

const PRODUCT_FEATURES = [
  "Designed in Florida",
  "Premium Materials",
  "Lightweight & Breathable",
  "Moisture-Wicking Performance",
  "Built for Saltwater & Freshwater",
  "Everyday Comfort",
  "Made to Last",
];

export const dynamic = "force-dynamic";

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

  const speciesLabel = product.species
    ? SPECIES_LABELS[product.species]
    : PRODUCT_CATEGORY_LABELS[product.category];

  const content = await getContent([
    "product.brand.title",
    "product.brand.description",
    "product.brand.features",
  ]);
  const brandFeatures = c(
    content,
    "product.brand.features",
    PRODUCT_FEATURES.join("\n"),
  )
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

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

            {product.inStock ? (
              <AddToCartSection product={product} />
            ) : (
              <div className="mt-6">
                <span className="inline-block bg-[#f87171]/15 px-3 py-1 font-condensed text-xs uppercase tracking-widest text-[#f87171]">
                  Out of Stock
                </span>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="mt-4 block w-full cursor-not-allowed bg-[rgba(30,46,26,0.15)] px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-brand-textMuted"
                >
                  Out of Stock
                </button>
              </div>
            )}

            {/* Brand values */}
            <hr className="my-6 border-brand-border" />
            <h2 className="mb-3 font-display text-lg text-brand-textPrimary">
              {c(content, "product.brand.title", "Built to Perform. Designed to Last.")}
            </h2>
            <p className="mb-4 font-body text-sm text-brand-textMuted">
              {c(content, "product.brand.description", PRODUCT_BLURB)}
            </p>
            <ul className="space-y-1">
              {brandFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 font-body text-sm text-brand-textPrimary"
                >
                  <span className="text-brand-rust">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
