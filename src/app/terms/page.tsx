import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Reel Purpose",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of Terms",
    body: (
      <>
        <p>
          By accessing reelpurpose.fishing, you agree to be bound by these Terms
          of Service.
        </p>
        <p>[Full terms to be provided by legal counsel]</p>
      </>
    ),
  },
  {
    heading: "2. Products and Purchases",
    body: <p>[Content to be provided by legal counsel]</p>,
  },
  {
    heading: "3. Returns and Refunds",
    body: <p>[Content to be provided by legal counsel]</p>,
  },
  {
    heading: "4. Contact Us",
    body: (
      <p>For questions about these Terms, contact us at reelpurpose.fishing</p>
    ),
  },
];

export default function TermsPage() {
  return <LegalPage title="TERMS OF SERVICE" sections={SECTIONS} />;
}
