"use client";

import { useRouter, usePathname } from "next/navigation";

const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function StoryFilters({
  status,
  counts,
}: {
  status: string;
  counts: { all: number; PENDING: number; APPROVED: number; REJECTED: number };
}) {
  const router = useRouter();
  const pathname = usePathname();

  const countFor = (value: string) =>
    value === ""
      ? counts.all
      : counts[value as "PENDING" | "APPROVED" | "REJECTED"];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active = status === tab.value;
        return (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() =>
              router.push(tab.value ? `${pathname}?status=${tab.value}` : pathname)
            }
            className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
              active
                ? "bg-[#c9a84c] text-[#0f1117]"
                : "border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] text-[rgba(240,230,211,0.6)] hover:text-[#f0e6d3]"
            }`}
          >
            {tab.label} ({countFor(tab.value)})
          </button>
        );
      })}
    </div>
  );
}
