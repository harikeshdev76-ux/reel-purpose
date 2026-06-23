import Link from "next/link";
import Image from "next/image";

const MARQUEE_PHRASE = "— FISHING WITH PURPOSE. BUILT IN FLORIDA. MADE FOR LIFE. ";

const CATEGORIES = [
  {
    title: "SALTWATER",
    subtitle: "Tarpon · Snook · Redfish · Tuna / Mahi",
    href: "/shop?category=saltwater",
    cta: "SHOP SALTWATER →",
  },
  {
    title: "FRESHWATER",
    subtitle: "Bass · Lake · River",
    href: "/shop?category=freshwater",
    cta: "SHOP FRESHWATER →",
  },
];

export default function Home() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-164px)] w-full flex-col justify-end overflow-hidden bg-[#0d1117]">
        {/* Background image — clean (no baked-in text); boat is centered */}
        <Image
          src="/background_with_no_logo.png"
          alt="Florida sunset over the water"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQYK/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwyWtdVc1VuVelqalSy6tUthBWVEnJJJyT70pSlSuJf//Z"
          className="object-cover object-center"
        />
        {/* Cinematic overlay — bright sky, darkened bottom where text sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.35) 40%, rgba(13,17,23,0.72) 70%, rgba(13,17,23,0.92) 100%)",
          }}
        />
        {/* Left-side vignette — darkens bottom-left where desktop text sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(13,17,23,0.45) 0%, rgba(13,17,23,0.0) 60%)",
          }}
        />

        {/* Bottom content — flex child pinned to bottom by justify-end */}
        <div className="relative z-10 px-6 pb-20 md:px-12 md:pb-24 lg:px-16">
          <h1 className="font-display leading-[0.9] text-[min(56px,10vh)] md:text-[min(80px,12vh)] lg:text-[min(108px,13vh)]">
            <span className="block text-[#f0e6d3]">FISHING</span>
            <span className="block text-[#f0e6d3]">WITH</span>
            <span className="block text-[#c9a84c]">PURPOSE.</span>
          </h1>
          <p className="mt-2 font-condensed text-xs uppercase tracking-[0.2em] text-[#7eb8a4] md:mt-3 md:text-sm">
            Built in Florida. Made for life.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-8">
            <Link
              href="/shop?type=TSHIRT"
              className="w-full rounded-full bg-[#c9a84c] px-8 py-3 text-center font-condensed text-sm font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] sm:w-auto"
            >
              Shop Apparel
            </Link>
            <Link
              href="/about"
              className="w-full rounded-full border border-[#f0e6d3] px-8 py-3 text-center font-condensed text-sm font-bold uppercase tracking-widest text-[#f0e6d3] transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c] sm:w-auto"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Bottom marquee ticker — shown on all sizes for a finished bottom edge */}
        <div className="absolute bottom-0 left-0 z-10 block w-full overflow-hidden border-t border-[rgba(201,168,76,0.3)] bg-[rgba(13,17,23,0.75)] py-2 md:py-3">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="px-2 font-condensed text-[10px] uppercase tracking-widest text-[#c9a84c] md:text-sm"
              >
                {MARQUEE_PHRASE}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SHOP BY CATEGORY ──────────────────── */}
      <section className="bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Eyebrow with gold line accents */}
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
              Shop By Category
            </span>
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group block border-t-2 border-t-[#c9a84c] border-x border-b border-x-[rgba(201,168,76,0.2)] border-b-[rgba(201,168,76,0.2)] bg-[#141b22] transition-colors hover:border-x-[rgba(201,168,76,0.6)] hover:border-b-[rgba(201,168,76,0.6)]"
              >
                {/* Placeholder image area */}
                <div className="h-64 w-full bg-gradient-to-b from-[#1a2530] to-[#0d1117]" />
                <div className="p-8">
                  <h3 className="font-display text-4xl text-[#f0e6d3]">
                    {category.title}
                  </h3>
                  <p className="mt-2 font-condensed text-sm uppercase tracking-widest text-[#7eb8a4]">
                    {category.subtitle}
                  </p>
                  <span className="mt-6 inline-block font-condensed text-sm uppercase tracking-widest text-[#c9a84c]">
                    {category.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── BRAND TAGLINE ──────────────────── */}
      <section className="border-y border-[rgba(201,168,76,0.15)] bg-[#141b22] py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          {/* Decorative gold line accent */}
          <div className="mx-auto mb-8 h-px w-16 bg-[#c9a84c]" />

          <h2 className="font-display leading-[0.95] text-[56px] md:text-[72px]">
            <span className="block text-[#f0e6d3]">MORE THAN FISHING.</span>
            <span className="block text-[#c9a84c]">IT&apos;S A PURPOSE.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-[rgba(240,230,211,0.55)]">
            Founded by Luca Giallombardo — built on faith, family, and a love
            for the water.
          </p>

          <div className="mt-8">
            <p className="font-body text-sm italic text-[#7eb8a4]">
              &ldquo;Then He said to them, Follow Me, and I will make you fishers
              of men.&rdquo;
            </p>
            <p className="mt-2 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
              — Matthew 4:19
            </p>
          </div>

          <Link
            href="/about"
            className="mt-10 inline-block rounded-full border-[1.5px] border-[#c9a84c] px-8 py-3 font-condensed text-sm uppercase tracking-widest text-[#c9a84c] transition-colors hover:bg-[#c9a84c] hover:text-[#0d1117]"
          >
            Read Our Story →
          </Link>
        </div>
      </section>
    </>
  );
}
