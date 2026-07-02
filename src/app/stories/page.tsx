import type { Metadata } from "next";
import { StoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import StoryCard from "@/components/stories/StoryCard";
import StorySubmitForm from "@/components/stories/StorySubmitForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Purpose Stories — Reel Purpose",
  description: "Real stories from the Reel Purpose community — why we fish.",
};

export default async function StoriesPage() {
  const stories = await prisma.purposeStory.findMany({
    where: { status: StoryStatus.APPROVED },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero strip */}
      <section className="border-b border-[rgba(201,168,76,0.2)] bg-[#141b22] px-6 py-16 text-center">
        <p className="mb-3 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
          Purpose Stories
        </p>
        <h1 className="font-display text-5xl text-[#f0e6d3] md:text-6xl">
          WHY WE FISH
        </h1>
        <p className="mt-3 font-body text-[rgba(240,230,211,0.55)]">
          Real stories from the Reel Purpose community.
        </p>
        <a
          href="#submit"
          className="mt-6 inline-block rounded-full bg-[#c9a84c] px-6 py-3 font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e]"
        >
          Share Your Story
        </a>
      </section>

      {/* Stories grid */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {stories.length === 0 ? (
          <p className="py-20 text-center font-body text-[rgba(240,230,211,0.5)]">
            No stories yet. Be the first to share yours!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>

      {/* Submit form */}
      <section
        id="submit"
        className="border-t border-[rgba(201,168,76,0.2)] bg-[#141b22] px-6 py-16"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-center font-display text-4xl text-[#f0e6d3]">
            SHARE YOUR STORY
          </h2>
          <p className="mb-8 text-center font-body text-sm text-[rgba(240,230,211,0.55)]">
            Tell us why you fish, where you fish, and who you fish with. Your
            story might inspire someone else to get out on the water.
          </p>
          <StorySubmitForm />
        </div>
      </section>
    </div>
  );
}
