"use client";

import { useRouter, usePathname } from "next/navigation";

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function quickRanges() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const q = Math.floor(m / 3);
  return {
    thisMonth: { from: fmt(new Date(y, m, 1)), to: fmt(now) },
    lastMonth: { from: fmt(new Date(y, m - 1, 1)), to: fmt(new Date(y, m, 0)) },
    thisQuarter: { from: fmt(new Date(y, q * 3, 1)), to: fmt(now) },
  };
}

export default function TaxDateFilter({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const apply = (range: { from: string; to: string }) => {
    const params = new URLSearchParams();
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const ranges = quickRanges();
  const presets: { label: string; range: { from: string; to: string } }[] = [
    { label: "This Month", range: ranges.thisMonth },
    { label: "Last Month", range: ranges.lastMonth },
    { label: "This Quarter", range: ranges.thisQuarter },
  ];

  const inputClass =
    "rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-3 py-2 font-body text-sm text-[#f0e6d3] focus:border-[#c9a84c] focus:outline-none";

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = from === p.range.from && to === p.range.to;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => apply(p.range)}
              className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "bg-[#c9a84c] text-[#0f1117]"
                  : "border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] text-[rgba(240,230,211,0.6)] hover:text-[#f0e6d3]"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => apply({ from: e.target.value, to })}
          className={inputClass}
          aria-label="From date"
        />
        <span className="text-[rgba(240,230,211,0.4)]">—</span>
        <input
          type="date"
          value={to}
          onChange={(e) => apply({ from, to: e.target.value })}
          className={inputClass}
          aria-label="To date"
        />
      </div>
    </div>
  );
}
