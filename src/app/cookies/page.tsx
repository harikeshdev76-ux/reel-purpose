import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { getContent, c } from "@/lib/content";
import { parseLegalContent } from "@/lib/renderLegalContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cookie Policy — Reel Purpose",
};

export default async function CookiesPage() {
  const content = await getContent([
    "legal.cookies.effectiveDate",
    "legal.cookies.content",
  ]);

  const sections: LegalSection[] = parseLegalContent(
    c(content, "legal.cookies.content", ""),
  ).map((section, i) => ({
    heading: `${i + 1}. ${section.title}`,
    body: <p className="whitespace-pre-line">{section.content}</p>,
  }));

  return (
    <LegalPage
      title="COOKIE POLICY"
      dateLine={c(content, "legal.cookies.effectiveDate", "Last updated: July 2026")}
      sections={sections}
    />
  );
}
