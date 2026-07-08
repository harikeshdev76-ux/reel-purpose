import Link from "next/link";
import Image from "next/image";
import { StoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getContent, c } from "@/lib/content";
import NewsletterForm from "@/components/NewsletterForm";
import MultilineText from "@/components/MultilineText";
import StoryCard from "@/components/stories/StoryCard";

// Homepage reads live approved stories + editable content, so render on demand.
export const dynamic = "force-dynamic";

const MARQUEE_PHRASE = "— FISHING WITH PURPOSE. BUILT IN FLORIDA. MADE FOR LIFE. ";

// Fallback copy — used only if a content key is missing from the DB.
const ORIGINALS_DESCRIPTION =
  "The collection that started it all. Clean, timeless, and built for life on the water. The Originals Collection features our signature performance shirts and embroidered hats, designed for anglers who appreciate quality without the extra flash. Whether you're running offshore before sunrise, exploring the backwaters, or spending the day with family, these are the essentials you'll reach for every time.";

const COMING_SOON_FALLBACK = [
  {
    title: "SALTWATER",
    subtitle: "Chase the Tide",
    description:
      "From early morning tarpon runs to offshore adventures, our Saltwater Collection is built for anglers who live for the next cast.",
  },
  {
    title: "FRESHWATER",
    subtitle: "Where Every Cast Begins",
    description:
      "Whether you're chasing bass at sunrise or spending weekends on your favorite lake, our Freshwater Collection celebrates the places where memories are made.",
  },
];

const VALUES_FALLBACK = [
  { icon: "✝", title: "Faith", body: "We believe every sunrise on the water is a reminder of God's incredible creation." },
  { icon: "🏠", title: "Family", body: "Some of life's greatest conversations happen in a boat before daylight." },
  { icon: "🧭", title: "Adventure", body: "Every trip brings new memories, new places, and new stories to tell." },
  { icon: "🌊", title: "Conservation", body: "We believe protecting our fisheries today ensures future generations can enjoy them tomorrow." },
  { icon: "🤝", title: "Community", body: "Fishing brings people together. We're proud to be part of a growing community that shares a passion for the outdoors." },
];

const PURPOSE_BODY_FALLBACK =
  "Fishing isn't just about catching fish.\n\nIt's about slowing down.\nIt's about sunrise conversations.\nIt's about learning patience.\nIt's about respecting God's creation.\nIt's about teaching the next generation.\n\nAt Reel Purpose, we believe every trip on the water is an opportunity to build stronger families, stronger faith, and unforgettable memories.\n\nThat's why every design we create represents something bigger than apparel.\n\nIt represents a life lived with purpose.";

export default async function Home() {
  const [stories, content] = await Promise.all([
    prisma.purposeStory.findMany({
      where: { status: StoryStatus.APPROVED },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getContent([
      "hero.headline.line1",
      "hero.headline.line2",
      "hero.subtext",
      "hero.cta.primary",
      "hero.cta.secondary",
      "hero.image",
      "collections.originals.eyebrow",
      "collections.originals.title",
      "collections.originals.description",
      "collections.originals.tagline",
      "collections.saltwater.title",
      "collections.saltwater.subtitle",
      "collections.saltwater.description",
      "collections.freshwater.title",
      "collections.freshwater.subtitle",
      "collections.freshwater.description",
      "purpose.headline.line1",
      "purpose.headline.line2",
      "purpose.body",
      "purpose.scripture",
      "purpose.scripture.attribution",
      "values.faith.title",
      "values.faith.description",
      "values.family.title",
      "values.family.description",
      "values.adventure.title",
      "values.adventure.description",
      "values.conservation.title",
      "values.conservation.description",
      "values.community.title",
      "values.community.description",
      "newsletter.eyebrow",
      "newsletter.headline",
      "newsletter.subtext",
      "newsletter.button",
    ]),
  ]);

  const comingSoon = [
    {
      title: c(content, "collections.saltwater.title", COMING_SOON_FALLBACK[0].title),
      subtitle: c(content, "collections.saltwater.subtitle", COMING_SOON_FALLBACK[0].subtitle),
      description: c(content, "collections.saltwater.description", COMING_SOON_FALLBACK[0].description),
    },
    {
      title: c(content, "collections.freshwater.title", COMING_SOON_FALLBACK[1].title),
      subtitle: c(content, "collections.freshwater.subtitle", COMING_SOON_FALLBACK[1].subtitle),
      description: c(content, "collections.freshwater.description", COMING_SOON_FALLBACK[1].description),
    },
  ];

  const values = [
    { icon: "✝", title: c(content, "values.faith.title", VALUES_FALLBACK[0].title), body: c(content, "values.faith.description", VALUES_FALLBACK[0].body) },
    { icon: "🏠", title: c(content, "values.family.title", VALUES_FALLBACK[1].title), body: c(content, "values.family.description", VALUES_FALLBACK[1].body) },
    { icon: "🧭", title: c(content, "values.adventure.title", VALUES_FALLBACK[2].title), body: c(content, "values.adventure.description", VALUES_FALLBACK[2].body) },
    { icon: "🌊", title: c(content, "values.conservation.title", VALUES_FALLBACK[3].title), body: c(content, "values.conservation.description", VALUES_FALLBACK[3].body) },
    { icon: "🤝", title: c(content, "values.community.title", VALUES_FALLBACK[4].title), body: c(content, "values.community.description", VALUES_FALLBACK[4].body) },
  ];

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-164px)] w-full flex-col justify-end overflow-hidden bg-[#0d1117]">
        <Image
          src={c(content, "hero.image", "/background_with_no_logo.png")}
          alt="Florida sunset over the water"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQYK/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwyWtdVc1VuVelqalSy6tUthBWVEnJJJyT70pSlSuJf//Z"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.35) 40%, rgba(13,17,23,0.72) 70%, rgba(13,17,23,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(13,17,23,0.45) 0%, rgba(13,17,23,0.0) 60%)",
          }}
        />

        <div className="relative z-10 px-6 pb-20 md:px-12 md:pb-24 lg:px-16">
          <h1 className="font-display leading-[0.9] text-[min(56px,10vh)] md:text-[min(80px,12vh)] lg:text-[min(108px,13vh)]">
            <span className="block text-[#f0e6d3]">
              {c(content, "hero.headline.line1", "FISHING WITH")}
            </span>
            <span className="block text-[#c9a84c]">
              {c(content, "hero.headline.line2", "PURPOSE.")}
            </span>
          </h1>
          <p className="mt-2 font-condensed text-xs uppercase tracking-[0.2em] text-[#7eb8a4] md:mt-3 md:text-sm">
            {c(content, "hero.subtext", "Built in Florida. Made for life.")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-8">
            <Link
              href="/shop?type=TSHIRT"
              className="w-full rounded-full bg-[#c9a84c] px-8 py-3 text-center font-condensed text-sm font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] sm:w-auto"
            >
              {c(content, "hero.cta.primary", "Shop Apparel")}
            </Link>
            <Link
              href="/about"
              className="w-full rounded-full border border-[#f0e6d3] px-8 py-3 text-center font-condensed text-sm font-bold uppercase tracking-widest text-[#f0e6d3] transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c] sm:w-auto"
            >
              {c(content, "hero.cta.secondary", "Our Story")}
            </Link>
          </div>
        </div>

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
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
              Collections
            </span>
            <hr className="flex-1 border-[rgba(201,168,76,0.25)]" />
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* Originals — active, links to shop */}
            <Link
              href="/shop?category=ORIGINALS"
              className="group block rounded-lg border border-t-2 border-[rgba(201,168,76,0.3)] border-t-[#c9a84c] bg-[#141b22] p-6 transition-colors hover:border-[rgba(201,168,76,0.6)]"
            >
              <p className="mb-2 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
                {c(content, "collections.originals.eyebrow", "Reel Purpose Originals")}
              </p>
              <h3 className="mb-3 font-display text-3xl text-[#f0e6d3]">
                {c(content, "collections.originals.title", "THE ORIGINALS")}
              </h3>
              <p className="mb-4 font-body text-sm leading-relaxed text-[rgba(240,230,211,0.6)]">
                {c(content, "collections.originals.description", ORIGINALS_DESCRIPTION)}
              </p>
              <p className="mb-4 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.4)]">
                {c(content, "collections.originals.tagline", "Simple. Comfortable. Built with Purpose.")}
              </p>
              <span className="font-condensed text-sm uppercase tracking-widest text-[#c9a84c] transition-colors group-hover:text-[#b8952e]">
                Shop Originals →
              </span>
            </Link>

            {/* Saltwater + Freshwater — coming soon, not clickable */}
            {comingSoon.map((collection) => (
              <div
                key={collection.title}
                className="cursor-default rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(20,27,34,0.5)] p-6 opacity-75"
              >
                <span className="mb-3 inline-block rounded-full bg-[rgba(201,168,76,0.1)] px-3 py-1 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
                  Coming Soon
                </span>
                <h3 className="mb-2 font-display text-3xl text-[rgba(240,230,211,0.4)]">
                  {collection.title}
                </h3>
                <p className="mb-2 font-display text-xl text-[rgba(240,230,211,0.3)]">
                  {collection.subtitle}
                </p>
                <p className="mb-3 font-body text-sm leading-relaxed text-[rgba(240,230,211,0.35)]">
                  {collection.description}
                </p>
                <p className="mb-1 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.3)]">
                  Featured Species
                </p>
                <p className="mb-4 font-condensed text-sm text-[rgba(201,168,76,0.35)]">
                  {collection.title === "SALTWATER"
                    ? "Tarpon • Snook • Redfish • Tuna • Mahi"
                    : "Bass • River • Lake"}
                </p>
                <span className="font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.3)]">
                  Launching Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PURPOSE ─────────────────────────── */}
      <section className="border-y border-[rgba(201,168,76,0.15)] bg-[#141b22] py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mx-auto mb-8 h-px w-16 bg-[#c9a84c]" />

          <h2 className="font-display leading-[0.95] text-[56px] md:text-[72px]">
            <span className="block text-[#f0e6d3]">
              {c(content, "purpose.headline.line1", "MORE THAN FISHING.")}
            </span>
            <span className="block text-[#c9a84c]">
              {c(content, "purpose.headline.line2", "IT'S A PURPOSE.")}
            </span>
          </h2>

          <MultilineText
            value={c(content, "purpose.body", PURPOSE_BODY_FALLBACK)}
            className="mx-auto mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-[rgba(240,230,211,0.7)] md:text-lg"
            groupClassName="space-y-2"
          />

          <div className="mt-8">
            <p className="font-body text-sm italic text-[#7eb8a4]">
              &ldquo;
              {c(
                content,
                "purpose.scripture",
                "Then He said to them, Follow Me, and I will make you fishers of men.",
              )}
              &rdquo;
            </p>
            <p className="mt-2 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
              — {c(content, "purpose.scripture.attribution", "Matthew 4:19")}
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
          {values.map((value) => (
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
            {c(content, "newsletter.eyebrow", "Join The Crew")}
          </p>
          <h2 className="mb-3 font-display text-4xl text-[#f0e6d3] md:text-5xl">
            {c(content, "newsletter.headline", "Join The Crew")}
          </h2>
          <p className="mb-8 font-body text-base text-[rgba(240,230,211,0.55)]">
            {c(
              content,
              "newsletter.subtext",
              "Get exclusive product launches, fishing stories, giveaways, and early access to limited-edition collections.",
            )}
          </p>
          <NewsletterForm
            buttonLabel={c(content, "newsletter.button", "Join the Crew →")}
          />
        </div>
      </section>
    </>
  );
}
