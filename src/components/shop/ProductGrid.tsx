"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@prisma/client";
import ProductCard from "./ProductCard";
import SpeciesFilter from "./SpeciesFilter";

type ProductGridProps = {
  products: Product[];
  selectedSpecies: string | null;
  selectedType: string | null;
};

const TYPE_TABS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "T-Shirts", value: "TSHIRT" },
  { label: "Hats", value: "HAT" },
];

const BASE_TAB =
  "px-4 py-2 font-condensed text-sm uppercase tracking-widest transition-colors";
const ACTIVE_TAB = "bg-brand-sectionGreen text-brand-textOnDark";
const INACTIVE_TAB =
  "bg-brand-surface border border-brand-border text-brand-textMuted hover:border-brand-sectionGreen";

export default function ProductGrid({
  products,
  selectedSpecies,
  selectedType,
}: ProductGridProps) {
  const router = useRouter();

  function pushFilter(species: string | null, type: string | null) {
    const params = new URLSearchParams();
    if (species) params.set("species", species);
    if (type) params.set("type", type);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <section className="bg-brand-base">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-condensed text-sm uppercase tracking-widest text-brand-rust">
          The Collection
        </p>
        <h1 className="mt-2 font-display text-5xl text-brand-textPrimary">
          Shop All Gear
        </h1>

        <div className="mt-8 space-y-4">
          <SpeciesFilter
            selected={selectedSpecies}
            onSelect={(species) => pushFilter(species, selectedType)}
          />
          <div className="flex flex-wrap gap-3">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => pushFilter(selectedSpecies, tab.value)}
                className={`${BASE_TAB} ${
                  selectedType === tab.value ? ACTIVE_TAB : INACTIVE_TAB
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="mt-16 font-body text-brand-textMuted">
            No products found for this filter.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
