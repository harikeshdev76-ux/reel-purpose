"use client";

import { useRouter, usePathname } from "next/navigation";

const STATUSES = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Fulfilled", value: "FULFILLED" },
  { label: "Shipped", value: "SHIPPED" },
];

export default function VendorStatusFilter({ status }: { status: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const apply = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {STATUSES.map((s) => {
        const active = status === s.value;
        return (
          <button
            key={s.value || "all"}
            type="button"
            onClick={() => apply(s.value)}
            className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
              active
                ? "bg-[#c9a84c] text-[#0f1117]"
                : "border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] text-[rgba(240,230,211,0.6)] hover:text-[#f0e6d3]"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
