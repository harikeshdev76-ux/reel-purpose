import Image from "next/image";
import type { Metadata } from "next";
import { getContent, c } from "@/lib/content";
import MultilineText from "@/components/MultilineText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story — Reel Purpose",
  description:
    "Meet Luca, founder of Reel Purpose — a Florida fishing apparel brand built on faith, family, fishing, and the outdoors.",
};

const ABOUT_BODY_FALLBACK =
  "Hi, I'm Luca.\n\nI grew up in Florida where some of my greatest memories were made fishing.\n\nThose mornings taught me lessons that had nothing to do with catching fish.\n\nThey taught me patience.\nHard work.\nFaith.\nRespect for nature.\nAnd how valuable time with family truly is.\n\nReel Purpose was created because I wanted a brand that represents everything fishing has given me—not just the excitement of the catch, but the people beside me and the memories we'll never forget.\n\nEvery shirt, every hat, and every design reminds us that life is about much more than fishing.\n\nIt's about living with purpose.\n\nThank you for being part of our journey.\nSee you on the water.";

const SCRIPTURE =
  "Then He said to them, 'Follow Me, and I will make you fishers of men.'";

export default async function AboutPage() {
  const content = await getContent([
    "about.title",
    "about.subtitle",
    "about.body",
    "about.tagline",
    "about.image",
  ]);

  return (
    <section className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-4xl text-[#f0e6d3] md:text-[56px]">
          {c(content, "about.title", "Meet Luca")}
        </h1>
        <p className="mt-2 font-condensed text-sm uppercase tracking-widest text-[#c9a84c]">
          {c(content, "about.subtitle", "Founder, Reel Purpose")}
        </p>

        {/* Two-column: story left, photo right */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="font-body text-base leading-relaxed text-[rgba(240,230,211,0.7)]">
            <MultilineText
              value={c(content, "about.body", ABOUT_BODY_FALLBACK)}
              className="space-y-5"
              groupClassName="space-y-1"
            />
            <p className="mt-6 font-display text-xl text-[#f0e6d3]">— Luca</p>
          </div>

          <div className="sticky top-8 w-full self-start overflow-hidden rounded-lg border border-[rgba(201,168,76,0.2)]">
            <Image
              src={c(content, "about.image", "/ourstory.jpeg")}
              alt="Luca Giallombardo — Founder, Reel Purpose"
              width={600}
              height={800}
              className="h-auto w-full rounded-lg"
              priority
            />
          </div>
        </div>

        <p className="mt-12 text-center font-display text-2xl text-[#c9a84c]">
          {c(content, "about.tagline", "More than fishing. It's a purpose. 🎣🌊")}
        </p>

        <blockquote className="mx-auto mt-8 max-w-2xl text-center">
          <p className="font-body text-base italic text-[#7eb8a4]">
            &ldquo;{SCRIPTURE}&rdquo;
          </p>
          <cite className="mt-2 block font-condensed text-sm uppercase not-italic tracking-widest text-[#c9a84c]">
            — Matthew 4:19
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
