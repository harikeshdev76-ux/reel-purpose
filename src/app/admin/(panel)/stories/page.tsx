import Image from "next/image";
import { StoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import StoryFilters from "@/components/admin/StoryFilters";
import StoryModerationActions from "@/components/admin/StoryModerationActions";

type AdminStoriesPageProps = {
  searchParams: { status?: string };
};

const STATUS_STYLES: Record<StoryStatus, string> = {
  PENDING: "bg-[rgba(251,146,60,0.15)] text-[#fb923c]",
  APPROVED: "bg-[rgba(74,222,128,0.15)] text-[#4ade80]",
  REJECTED: "bg-[rgba(255,255,255,0.05)] text-[rgba(240,230,211,0.4)]",
};

function parseStatus(value: string | undefined): StoryStatus | undefined {
  if (value && Object.values(StoryStatus).includes(value as StoryStatus)) {
    return value as StoryStatus;
  }
  return undefined;
}

export default async function AdminStoriesPage({
  searchParams,
}: AdminStoriesPageProps) {
  const activeStatus = parseStatus(searchParams.status);
  const all = await prisma.purposeStory.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    all: all.length,
    PENDING: all.filter((s) => s.status === "PENDING").length,
    APPROVED: all.filter((s) => s.status === "APPROVED").length,
    REJECTED: all.filter((s) => s.status === "REJECTED").length,
  };

  const stories = activeStatus
    ? all.filter((s) => s.status === activeStatus)
    : all;

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">
        Purpose Stories
      </h1>

      <StoryFilters status={searchParams.status ?? ""} counts={counts} />

      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {[
                "Photo",
                "Name",
                "Location",
                "Story",
                "Submitted",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No stories submitted yet.
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr
                  key={story.id}
                  className="border-t border-[rgba(255,255,255,0.05)] align-top text-sm text-[#f0e6d3]"
                >
                  <td className="px-4 py-3">
                    {story.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded">
                        <Image
                          src={story.imageUrl}
                          alt={story.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded bg-[rgba(255,255,255,0.05)]" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-body">{story.name}</td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {story.location ?? "—"}
                  </td>
                  <td className="max-w-xs px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {story.story.length > 80
                      ? `${story.story.slice(0, 80)}…`
                      : story.story}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {story.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-condensed text-xs uppercase ${STATUS_STYLES[story.status]}`}
                    >
                      {story.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StoryModerationActions
                      storyId={story.id}
                      status={story.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
