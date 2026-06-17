import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Reel Purpose",
  description:
    "Meet Luca Giallombardo, founder of Reel Purpose — a Florida fishing apparel brand built on faith, family, fishing, and the outdoors.",
};

const STORY_PARAGRAPHS = [
  "Hi, I'm Luca Giallombardo, founder of Reel Purpose.",
  "Born and raised in Florida, I've spent countless hours on the water fishing with family and friends. Some of my best memories have come from early mornings, chasing fish, and enjoying the outdoors.",
  "Fishing has taught me patience, hard work, and respect for God's creation. It has also shown me the importance of family, adventure, and making the most of every day.",
  "I started Reel Purpose because I wanted to create more than just fishing apparel. I wanted to build a brand that represents the lifestyle we love—faith, family, fishing, and the outdoors. Whether you're fishing the flats, running offshore, or casting from the shore, I hope Reel Purpose reminds you to enjoy the journey and make every trip count.",
  "Thank you for being part of the journey.",
];

const TAGLINE = "More than fishing. It's a purpose. 🎣🌊";

const SCRIPTURE =
  "Then He said to them, 'Follow Me, and I will make you fishers of men.'";

export default function AboutPage() {
  return (
    <section className="bg-brand-base">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="font-display text-4xl text-brand-textPrimary md:text-[56px]">
          Meet Luca
        </h1>
        <p className="mt-2 font-condensed text-sm uppercase tracking-widest text-brand-rust">
          Founder, Reel Purpose
        </p>

        <div className="mt-10 space-y-6 font-body text-lg leading-relaxed text-brand-textPrimary">
          {STORY_PARAGRAPHS.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-8">
          <p className="font-display text-xl text-brand-textPrimary">
            Luca Giallombardo
          </p>
          <p className="mt-1 font-condensed text-sm uppercase tracking-widest text-brand-textMuted">
            Founder, Reel Purpose
          </p>
        </div>

        {/* Tagline */}
        <p className="mt-12 text-center font-display text-2xl text-brand-rust">
          {TAGLINE}
        </p>

        {/* Scripture quote block */}
        <blockquote className="mt-8 border-l-4 border-brand-sectionGreen pl-5">
          <p className="font-body text-base italic text-brand-textMuted">
            {SCRIPTURE}
          </p>
          <cite className="mt-2 block font-condensed text-sm uppercase not-italic tracking-widest text-brand-textMuted">
            — Matthew 4:19
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
