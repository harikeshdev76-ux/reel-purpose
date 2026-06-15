import Link from "next/link";

const SPECIES = [
  { name: "Tarpon", value: "TARPON" },
  { name: "Snook", value: "SNOOK" },
  { name: "Redfish", value: "REDFISH" },
  { name: "Tuna / Mahi", value: "TUNA_MAHI" },
  { name: "Bass", value: "BASS" },
  { name: "Coming Soon", value: null },
];

const FEATURED_PRODUCTS = [
  { name: "Tarpon Silhouette Tee", species: "Tarpon Series", price: "$38" },
  { name: "Snook Strike Hat", species: "Snook Series", price: "$32" },
  { name: "Redfish Tail Tee", species: "Redfish Series", price: "$38" },
];

export default function Home() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="bg-brand-base">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:py-24">
          {/* Left */}
          <div className="lg:flex-[1.2]">
            <p className="border-l-2 border-brand-sectionGreen pl-3 font-condensed text-sm uppercase tracking-widest text-brand-sectionGreen">
              Florida Fishing Apparel
            </p>
            <h1 className="mt-5 font-display text-[56px] leading-[0.95] text-brand-textPrimary md:text-[88px]">
              BUILT FOR THE <span className="text-brand-rust">TIDE.</span>
            </h1>
            <p className="mt-5 max-w-xl font-body text-lg text-brand-textMuted">
              Saltwater, freshwater, family, and purpose-driven anglers. Gear
              that wears your passion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-brand-rust px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-rustHover"
              >
                Shop Collections
              </Link>
              <Link
                href="/about"
                className="border border-brand-textPrimary/30 px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-brand-textPrimary transition-colors hover:border-brand-textPrimary"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Right: featured product card */}
          <div className="w-full lg:flex-[0.9]">
            <div className="mx-auto max-w-md bg-brand-surface p-5 shadow-sm">
              <div className="flex aspect-[4/3] items-center justify-center bg-black/10">
                <span className="font-condensed text-sm uppercase tracking-widest text-brand-textMuted">
                  Product Image
                </span>
              </div>
              <span className="mt-4 inline-block bg-brand-sectionGreen px-3 py-1 font-condensed text-xs uppercase tracking-widest text-brand-textOnDark">
                Tarpon Series
              </span>
              <h3 className="mt-3 font-display text-2xl text-brand-textPrimary">
                Tarpon Silhouette Tee
              </h3>
              <p className="mt-1 font-body text-sm text-brand-textMuted">
                Premium cotton blend · Sizes S–XXL
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-3xl text-brand-rust">$38</span>
                <button
                  type="button"
                  className="bg-brand-sectionGreen px-5 py-2 font-condensed text-sm font-bold uppercase tracking-widest text-brand-textOnDark transition-colors hover:bg-brand-greenLight"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── SPECIES COLLECTION ──────────────────── */}
      <section id="species" className="bg-brand-sectionGreen">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-condensed text-sm uppercase tracking-widest text-brand-textOnDark/50">
            Browse By Species
          </p>
          <h2 className="mt-2 font-display text-5xl text-brand-textOnDark">
            FIND YOUR FISH
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIES.map((species) => {
              const isComingSoon = species.value === null;
              const cardBody = (
                <div
                  className={`flex h-full flex-col items-center gap-4 border border-brand-borderOnDark bg-brand-textOnDark/[0.08] p-8 transition-colors ${
                    isComingSoon ? "opacity-50" : "group-hover:bg-brand-rust"
                  }`}
                >
                  <div className="h-20 w-20 rounded-full bg-brand-textOnDark/15" />
                  <span className="font-condensed text-lg uppercase tracking-widest text-brand-textOnDark">
                    {species.name}
                  </span>
                  <span className="font-condensed text-sm uppercase tracking-widest text-brand-textOnDark/60">
                    {isComingSoon ? "Coming Soon" : "Shop →"}
                  </span>
                </div>
              );

              return isComingSoon ? (
                <div key={species.name} className="group">
                  {cardBody}
                </div>
              ) : (
                <Link
                  key={species.name}
                  href={`/shop?species=${species.value}`}
                  className="group"
                >
                  {cardBody}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── FEATURED PRODUCTS ──────────────────── */}
      <section className="bg-brand-base">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-condensed text-sm uppercase tracking-widest text-brand-rust">
            Featured Gear
          </p>
          <h2 className="mt-2 font-display text-5xl text-brand-textPrimary">
            HAND-PICKED FAVORITES
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.name} className="bg-brand-surface p-5 shadow-sm">
                <div className="flex aspect-[4/3] items-center justify-center bg-black/10">
                  <span className="font-condensed text-sm uppercase tracking-widest text-brand-textMuted">
                    Product Image
                  </span>
                </div>
                <span className="mt-4 inline-block bg-brand-sectionGreen px-3 py-1 font-condensed text-xs uppercase tracking-widest text-brand-textOnDark">
                  {product.species}
                </span>
                <h3 className="mt-3 font-display text-2xl text-brand-textPrimary">
                  {product.name}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-3xl text-brand-rust">
                    {product.price}
                  </span>
                  <button
                    type="button"
                    className="bg-brand-sectionGreen px-5 py-2 font-condensed text-sm font-bold uppercase tracking-widest text-brand-textOnDark transition-colors hover:bg-brand-greenLight"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/shop"
              className="font-condensed text-sm font-bold uppercase tracking-widest text-brand-rust transition-colors hover:text-brand-rustHover"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────── BRAND STORY ──────────────────────── */}
      <section className="bg-brand-navBg">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
          <div className="lg:flex-1">
            <p className="font-condensed text-sm uppercase tracking-widest text-brand-rust">
              Our Story
            </p>
            <h2 className="mt-3 font-display text-[64px] leading-[0.95] text-brand-textOnDark">
              BUILT FOR THE TIDE.
            </h2>
            <div className="mt-5 max-w-xl space-y-4 font-body text-brand-textOnDark/70">
              <p>
                Reel Purpose was born on the water. Every design is tied to a
                species, a place, and a reason to fish.
              </p>
              <p>Luca&apos;s brand. Florida&apos;s soul.</p>
            </div>
            <Link
              href="/about"
              className="mt-7 inline-block font-condensed text-sm font-bold uppercase tracking-widest text-brand-rust transition-colors hover:text-brand-rustHover"
            >
              Learn More →
            </Link>
          </div>

          {/* Decorative accent */}
          <div className="lg:flex-1">
            <div className="flex aspect-[4/3] items-center justify-center border border-brand-borderOnDark bg-brand-textOnDark/[0.04]">
              <span className="font-condensed text-sm uppercase tracking-widest text-brand-textOnDark/40">
                Reel Purpose
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
