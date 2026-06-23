"use client";

import { useState, type ReactNode } from "react";

export default function Collapsible({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-body text-sm text-[rgba(240,230,211,0.4)] transition-colors hover:text-[rgba(240,230,211,0.7)]"
      >
        <span>{open ? "▲" : "▼"}</span>
        {title}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
