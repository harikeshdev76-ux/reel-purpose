import Image from "next/image";
import type { PurposeStory } from "@prisma/client";

export default function StoryCard({ story }: { story: PurposeStory }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] transition-colors hover:border-[rgba(201,168,76,0.5)]">
      {story.imageUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={story.imageUrl}
            alt={story.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display text-lg text-[#f0e6d3]">{story.name}</h3>
        {story.location && (
          <p className="mt-1 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
            {story.location}
          </p>
        )}
        <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-[rgba(240,230,211,0.7)]">
          {story.story}
        </p>
        <p className="mt-3 font-condensed text-xs text-[rgba(240,230,211,0.35)]">
          {story.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
