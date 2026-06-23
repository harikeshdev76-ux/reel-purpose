"use client";

import { useRouter, usePathname } from "next/navigation";

const STATUSES = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Fulfilled", value: "FULFILLED" },
  { label: "Shipped", value: "SHIPPED" },
];

export default function OrderFilters({
  status,
  from,
  to,
}: {
  status: string;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const apply = (next: { status?: string; from?: string; to?: string }) => {
    const params = new URLSearchParams();
    const merged = { status, from, to, ...next };
    if (merged.status) params.set("status", merged.status);
    if (merged.from) params.set("from", merged.from);
    if (merged.to) params.set("to", merged.to);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const inputClass =
    "rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-3 py-2 font-body text-sm text-[#f0e6d3] focus:border-[#c9a84c] focus:outline-none";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = status === s.value;
          return (
            <button
              key={s.value || "all"}
              type="button"
              onClick={() => apply({ status: s.value })}
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

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => apply({ from: e.target.value })}
          className={inputClass}
          aria-label="From date"
        />
        <span className="text-[rgba(240,230,211,0.4)]">—</span>
        <input
          type="date"
          value={to}
          onChange={(e) => apply({ to: e.target.value })}
          className={inputClass}
          aria-label="To date"
        />
      </div>
    </div>
  );
}
