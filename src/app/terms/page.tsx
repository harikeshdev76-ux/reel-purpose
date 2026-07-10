import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { getContent, c } from "@/lib/content";
import { parseLegalContent } from "@/lib/renderLegalContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service — Reel Purpose",
};

export default async function TermsPage() {
  const content = await getContent([
    "legal.terms.effectiveDate",
    "legal.terms.content",
  ]);

  const sections: LegalSection[] = parseLegalContent(
    c(content, "legal.terms.content", ""),
  ).map((section, i) => ({
    heading: `${i + 1}. ${section.title}`,
    body: <p className="whitespace-pre-line">{section.content}</p>,
  }));

  return (
    <LegalPage
      title="TERMS OF SERVICE"
      dateLine={c(content, "legal.terms.effectiveDate", "Last updated: July 2026")}
      sections={sections}
    />
  );
}
