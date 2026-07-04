import Link from "next/link";
import Image from "next/image";
import { StoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import NewsletterForm from "@/components/NewsletterForm";
import StoryCard from "@/components/stories/StoryCard";

// Homepage reads live approved stories, so render on demand rather than statically.
export const dynamic = "force-dynamic";

const MARQUEE_PHRASE = "— FISHING WITH PURPOSE. BUILT IN FLORIDA. MADE FOR LIFE. ";

const COLLECTIONS = [
  {
    title: "SALTWATER",
    headline: "Chase the Tide",
    description:
      "From early morning tarpon runs to offshore adventures, our Saltwater Collection is built for anglers who live for the next cast.",
    species: "Tarpon • Snook • Redfish • Tuna • Mahi",
    href: "/shop?category=saltwater",
    cta: "Shop Saltwater →",
  },
  {
    title: "FRESHWATER",
    headline: "Where Every Cast Begins",
    description:
      "Whether you're chasing bass at sunrise or spending weekends on your favorite lake, our Freshwater Collection celebrates the places where memories are made.",
    species: "Bass • River • Lake",
    href: "/shop?category=freshwater",
    cta: "Shop Freshwater →",
  },
];

const VALUES = [
  {
    icon: "✝",
    title: "Faith",
    body: "We believe every sunrise on the water is a reminder of God's incredible creation.",
  },
  {
    icon: "🏠",
    title: "Family",
    body: "Some of life's greatest conversations happen in a boat before daylight.",
  },
  {
    icon: "🧭",
    title: "Adventure",
    body: "Every trip brings new memories, new places, and new stories to tell.",
  },
  {
    icon: "🌊",
    title: "Conservation",
    body: "We believe protecting our fisheries today ensures future generations can enjoy them tomorrow.",
  },
  {
    icon: "🤝",
    title: "Community",
    body: "Fishing brings people together. We're proud to be part of a growing community that shares a passion for the outdoors.",
  },
];

const PURPOSE_INTRO = "Fishing isn't just about catching fish.";
const PURPOSE_SHORT = [
  "It's about slowing down.",
  "It's about sunrise conversations.",
  "It's about learning patience.",
  "It's about respecting God's creation.",
  "It's about teaching the next generation.",
];
const PURPOSE_PARAGRAPHS = [
  "At Reel Purpose, we believe every trip on the water is an opportunity to build stronger families, stronger faith, and unforgettable memories.",
  "That's why every design we create represents something bigger than apparel.",
  "It represents a life lived with purpose.",
];

export default async function Home() {
  const stories = await prisma.purposeStory.findMany({
    where: { status: StoryStatus.APPROVED },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

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

      {/* ──────────────────────── COLLECTIONS ──────────────────────── */}
      <section className="bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Eyebrow with gold line accents */}
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
              Collections
            </span>
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.title}
                href={collection.href}
                className="group block border-t-2 border-x border-b border-t-[#c9a84c] border-x-[rgba(201,168,76,0.2)] border-b-[rgba(201,168,76,0.2)] bg-[#141b22] transition-colors hover:border-x-[rgba(201,168,76,0.6)] hover:border-b-[rgba(201,168,76,0.6)]"
              >
                {/* Placeholder image area */}
                <div className="h-64 w-full bg-gradient-to-b from-[#1a2530] to-[#0d1117]" />
                <div className="p-8">
                  <h3 className="font-display text-4xl text-[#f0e6d3]">
                    {collection.title}
                  </h3>
                  <p className="mb-2 mt-1 font-display text-2xl text-[#f0e6d3]">
                    {collection.headline}
                  </p>
                  <p className="mb-3 font-body text-sm text-[rgba(240,230,211,0.6)]">
                    {collection.description}
                  </p>
                  <p className="mb-1 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.4)]">
                    Featured Species
                  </p>
                  <p className="mb-4 font-condensed text-sm text-[#c9a84c]">
                    {collection.species}
                  </p>
                  <span className="inline-block font-condensed text-sm uppercase tracking-widest text-[#c9a84c]">
                    {collection.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PURPOSE ─────────────────────────── */}
      <section className="border-y border-[rgba(201,168,76,0.15)] bg-[#141b22] py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          {/* Decorative gold line accent */}
          <div className="mx-auto mb-8 h-px w-16 bg-[#c9a84c]" />

          <h2 className="font-display leading-[0.95] text-[56px] md:text-[72px]">
            <span className="block text-[#f0e6d3]">MORE THAN FISHING.</span>
            <span className="block text-[#c9a84c]">IT&apos;S A PURPOSE.</span>
          </h2>

          <div className="mx-auto mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-[rgba(240,230,211,0.7)] md:text-lg">
            <p>{PURPOSE_INTRO}</p>
            <div className="space-y-2">
              {PURPOSE_SHORT.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {PURPOSE_PARAGRAPHS.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

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

      {/* ────────────────────────── WHY WE FISH ────────────────────────── */}
      <section className="border-t border-[rgba(201,168,76,0.15)] bg-[#141b22] px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
            Our Values
          </p>
          <h2 className="font-display text-4xl text-[#f0e6d3] md:text-5xl">
            WHY WE FISH
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-[rgba(201,168,76,0.15)] bg-[rgba(255,255,255,0.03)] p-6 transition-colors hover:border-[rgba(201,168,76,0.4)]"
            >
              <div className="mb-4 text-2xl text-[#c9a84c]">{value.icon}</div>
              <h3 className="mb-2 font-display text-xl text-[#c9a84c]">
                {value.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-[rgba(240,230,211,0.6)]">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── PURPOSE STORIES ───────────────────────── */}
      {stories.length > 0 && (
        <section className="border-t border-[rgba(201,168,76,0.15)] bg-[#0d1117] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-3 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
              Purpose Stories
            </p>
            <h2 className="font-display text-4xl text-[#f0e6d3] md:text-5xl">
              PURPOSE STORIES
            </h2>
            <p className="mt-2 font-body text-[rgba(240,230,211,0.55)]">
              Real stories from the Reel Purpose community.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          <Link
            href="/stories"
            className="mt-8 block text-center font-condensed text-sm uppercase tracking-widest text-[#c9a84c]"
          >
            Read All Stories →
          </Link>
        </section>
      )}

      {/* ────────────────────────── NEWSLETTER ────────────────────────── */}
      <section className="border-y border-[rgba(201,168,76,0.2)] bg-[#0d1117] py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="mb-3 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
            Join The Crew
          </p>
          <h2 className="mb-3 font-display text-4xl text-[#f0e6d3] md:text-5xl">
            Join The Crew
          </h2>
          <p className="mb-8 font-body text-base text-[rgba(240,230,211,0.55)]">
            Get exclusive product launches, fishing stories, giveaways, and
            early access to limited-edition collections.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
