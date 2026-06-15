"use client";

import { useState } from "react";
import type { Product, Size } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import SizeSelector from "./SizeSelector";

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Size | null>(null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!selected) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      species: product.species,
      price: product.price,
      size: selected,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-8">
      <p className="font-condensed text-sm uppercase tracking-widest text-brand-textPrimary">
        Select Size
      </p>
      <div className="mt-3">
        <SizeSelector
          sizes={product.sizes}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selected}
        className={`mt-6 w-full px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-white transition-colors ${
          selected
            ? "bg-brand-rust hover:bg-brand-rustHover"
            : "cursor-not-allowed bg-[rgba(30,46,26,0.3)]"
        }`}
      >
        Add to Cart
      </button>

      {added && (
        <p className="mt-3 font-condensed text-sm uppercase tracking-widest text-brand-rust">
          Added!
        </p>
      )}
    </div>
  );
}
