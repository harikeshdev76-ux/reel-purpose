"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StoryStatus } from "@prisma/client";

export default function StoryModerationActions({
  storyId,
  status,
}: {
  storyId: string;
  status: StoryStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject") {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/stories/${storyId}/${action}`, {
        method: "POST",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center">
      {status !== "APPROVED" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => act("approve")}
          className="rounded bg-[rgba(74,222,128,0.15)] px-3 py-1 font-condensed text-xs uppercase text-[#4ade80] transition-colors hover:bg-[rgba(74,222,128,0.25)] disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => act("reject")}
          className="ml-2 rounded bg-[rgba(248,113,113,0.15)] px-3 py-1 font-condensed text-xs uppercase text-[#f87171] transition-colors hover:bg-[rgba(248,113,113,0.25)] disabled:opacity-50"
        >
          Reject
        </button>
      )}
    </div>
  );
}
