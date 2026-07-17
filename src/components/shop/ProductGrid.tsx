"use client";

import { useRouter } from "next/navigation";
import type { Product, ProductCategory } from "@prisma/client";
import { PRODUCT_CATEGORY_SHORT } from "@/lib/productCategory";
import ProductCard from "./ProductCard";
import SpeciesFilter from "./SpeciesFilter";

type ProductGridProps = {
  products: Product[];
  selectedCategory: string | null;
  selectedSpecies: string | null;
  selectedType: string | null;
};

const CATEGORY_TABS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "Originals", value: "ORIGINALS" },
  { label: "Saltwater", value: "SALTWATER" },
  { label: "Freshwater", value: "FRESHWATER" },
];

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
  selectedCategory,
  selectedSpecies,
  selectedType,
}: ProductGridProps) {
  const router = useRouter();

  function pushFilter(
    category: string | null,
    species: string | null,
    type: string | null,
  ) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (species) params.set("species", species);
    if (type) params.set("type", type);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  const comingSoon =
    selectedCategory === "SALTWATER" || selectedCategory === "FRESHWATER";

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
          {/* Category (collection) pills */}
          <div className="flex flex-wrap gap-3">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() =>
                  pushFilter(tab.value, selectedSpecies, selectedType)
                }
                className={`${BASE_TAB} ${
                  selectedCategory === tab.value ? ACTIVE_TAB : INACTIVE_TAB
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {selectedCategory !== "ORIGINALS" && (
            <SpeciesFilter
              selected={selectedSpecies}
              onSelect={(species) =>
                pushFilter(selectedCategory, species, selectedType)
              }
            />
          )}
          <div className="flex flex-wrap gap-3">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() =>
                  pushFilter(selectedCategory, selectedSpecies, tab.value)
                }
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
          comingSoon ? (
            <p className="mt-12 py-12 text-center font-body text-brand-textMuted">
              The {PRODUCT_CATEGORY_SHORT[selectedCategory as ProductCategory]}{" "}
              Collection is coming soon. Check back for new drops!
            </p>
          ) : (
            <p className="mt-16 font-body text-brand-textMuted">
              No products found for this filter.
            </p>
          )
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
