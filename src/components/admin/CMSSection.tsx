"use client";

import { useState, type ReactNode } from "react";

export default function CMSSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between bg-[#1a1f2e] px-5 py-3 ${
          open ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="text-[rgba(240,230,211,0.5)]">
            {open ? "▲" : "▼"}
          </span>
          <span className="font-display text-lg text-[#f0e6d3]">{title}</span>
        </span>
        <span className="font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
          {count} fields
        </span>
      </button>
      {open && (
        <div className="divide-y divide-[rgba(255,255,255,0.05)] rounded-b-lg border border-[rgba(255,255,255,0.08)] bg-[#141014]">
          {children}
        </div>
      )}
    </div>
  );
}
