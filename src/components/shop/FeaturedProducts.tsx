"use client";

import type { Product } from "@prisma/client";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="mt-10 font-body text-brand-textMuted">
        Featured products coming soon.
      </p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
