import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { getContent, c } from "@/lib/content";
import { parseLegalContent } from "@/lib/renderLegalContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy — Reel Purpose",
};

export default async function PrivacyPage() {
  const content = await getContent([
    "legal.privacy.effectiveDate",
    "legal.privacy.content",
  ]);

  const sections: LegalSection[] = parseLegalContent(
    c(content, "legal.privacy.content", ""),
  ).map((section, i) => ({
    heading: `${i + 1}. ${section.title}`,
    body: <p className="whitespace-pre-line">{section.content}</p>,
  }));

  return (
    <LegalPage
      title="PRIVACY POLICY"
      dateLine={c(content, "legal.privacy.effectiveDate", "Effective Date: July 2026")}
      sections={sections}
    />
  );
}
