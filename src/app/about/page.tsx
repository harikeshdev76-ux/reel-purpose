import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Reel Purpose",
  description:
    "Meet Luca, founder of Reel Purpose — a Florida fishing apparel brand built on faith, family, fishing, and the outdoors.",
};

const INTRO_PARAGRAPHS = [
  "Hi, I'm Luca.",
  "I grew up in Florida where some of my greatest memories were made fishing.",
  "Those mornings taught me lessons that had nothing to do with catching fish.",
];

const LESSON_LINES = [
  "They taught me patience.",
  "Hard work.",
  "Faith.",
  "Respect for nature.",
  "And how valuable time with family truly is.",
];

const MEANING_PARAGRAPHS = [
  "Reel Purpose was created because I wanted a brand that represents everything fishing has given me—not just the excitement of the catch, but the people beside me and the memories we'll never forget.",
  "Every shirt, every hat, and every design reminds us that life is about much more than fishing.",
  "It's about living with purpose.",
];

const CLOSING_LINES = [
  "Thank you for being part of our journey.",
  "See you on the water.",
];

const TAGLINE = "More than fishing. It's a purpose. 🎣🌊";
const SCRIPTURE =
  "Then He said to them, 'Follow Me, and I will make you fishers of men.'";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-4xl text-[#f0e6d3] md:text-[56px]">
          Meet Luca
        </h1>
        <p className="mt-2 font-condensed text-sm uppercase tracking-widest text-[#c9a84c]">
          Founder, Reel Purpose
        </p>

        {/* Two-column: story left, photo right (photo pending from Mike) */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="font-body text-base leading-relaxed text-[rgba(240,230,211,0.7)]">
            <div className="space-y-5">
              {INTRO_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-5 space-y-1">
              {LESSON_LINES.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-5 space-y-5">
              {MEANING_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-5 space-y-1">
              {CLOSING_LINES.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <p className="mt-6 font-display text-xl text-[#f0e6d3]">— Luca</p>
          </div>

          {/* Founder photo */}
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[rgba(201,168,76,0.2)]">
            <Image
              src="/ourstory.jpeg"
              alt="Luca Giallombardo — Founder, Reel Purpose"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-12 text-center font-display text-2xl text-[#c9a84c]">
          {TAGLINE}
        </p>

        {/* Scripture */}
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
