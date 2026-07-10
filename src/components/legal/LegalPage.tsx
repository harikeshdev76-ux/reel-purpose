import Link from "next/link";
import type { ReactNode } from "react";

export type LegalSection = { heading: string; body: ReactNode };

export default function LegalPage({
  title,
  sections,
  dateLine = "Last updated: July 2026",
}: {
  title: string;
  sections: LegalSection[];
  dateLine?: string;
}) {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 block font-condensed text-xs uppercase tracking-widest text-[#c9a84c] transition-colors hover:text-[#b8952e]"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-2 font-display text-5xl text-[#f0e6d3]">{title}</h1>
        <p className="mb-10 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
          {dateLine}
        </p>

        {sections.map((section, i) => (
          <section key={section.heading}>
            {i > 0 && <hr className="my-6 border-[rgba(201,168,76,0.1)]" />}
            <h2 className="mb-3 mt-8 font-display text-xl text-[#f0e6d3]">
              {section.heading}
            </h2>
            <div className="space-y-3 font-body text-sm leading-relaxed text-[rgba(240,230,211,0.65)]">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
