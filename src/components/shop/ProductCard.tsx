import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { SPECIES_LABELS } from "@/lib/species";
import { formatPrice } from "@/lib/money";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block transition-transform duration-200 hover:scale-[1.01]"
    >
      <article className="overflow-hidden border border-brand-border bg-brand-surface">
        <div className="relative aspect-square bg-black/10">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <span className="inline-block bg-brand-sectionGreen px-3 py-1 font-condensed text-xs uppercase tracking-widest text-brand-textOnDark">
            {SPECIES_LABELS[product.species]}
          </span>
          <h3 className="mt-3 font-display text-xl text-brand-textPrimary">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-2xl text-brand-rust">
              {formatPrice(product.price)}
            </span>
            <span className="bg-brand-sectionGreen px-4 py-2 font-condensed text-xs font-bold uppercase tracking-widest text-brand-textOnDark transition-colors group-hover:bg-brand-greenLight">
              View Product →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
