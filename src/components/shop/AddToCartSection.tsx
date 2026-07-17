"use client";

import { useState } from "react";
import type { Product, Size } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { getProductColor } from "@/lib/productColors";
import SizeSelector from "./SizeSelector";

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const hasColors = product.colors.length > 0;
  const canAdd = !!selected && (!hasColors || !!selectedColor);

  function handleAdd() {
    if (!canAdd || !selected) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      species: product.species,
      color: selectedColor ?? undefined,
      price: product.price,
      size: selected,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-8">
      {hasColors && (
        <div className="mb-6">
          <p className="mb-2 font-condensed text-xs uppercase tracking-widest text-brand-textMuted">
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((code) => {
              const col = getProductColor(code);
              if (!col) return null;
              const active = selectedColor === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedColor(code)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-colors ${
                    active
                      ? "border-brand-sectionGreen bg-[rgba(45,82,40,0.08)] text-brand-sectionGreen"
                      : "border-brand-border text-brand-textMuted hover:border-brand-sectionGreen"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-[rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-condensed text-xs uppercase">
                    {col.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        disabled={!canAdd}
        className={`mt-6 w-full px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-white transition-colors ${
          canAdd
            ? "bg-brand-rust hover:bg-brand-rustHover"
            : "cursor-not-allowed bg-[rgba(30,46,26,0.3)]"
        }`}
      >
        Add to Cart
      </button>

      {!canAdd && (
        <p className="mt-3 font-condensed text-xs uppercase tracking-widest text-brand-textMuted">
          Select a {hasColors ? "color and size" : "size"} to continue
        </p>
      )}
      {added && (
        <p className="mt-3 font-condensed text-sm uppercase tracking-widest text-brand-rust">
          Added!
        </p>
      )}
    </div>
  );
}
