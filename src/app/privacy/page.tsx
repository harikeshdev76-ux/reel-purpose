import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Reel Purpose",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Introduction",
    body: (
      <p>
        This Privacy Policy describes how Reel Purpose collects, uses, and
        shares information about you when you use our website at
        reelpurpose.fishing.
      </p>
    ),
  },
  {
    heading: "2. Information We Collect",
    body: (
      <>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, make a purchase, or contact us.
        </p>
        <p>[Full policy content to be provided by legal counsel]</p>
      </>
    ),
  },
  {
    heading: "3. How We Use Your Information",
    body: <p>[Content to be provided by legal counsel]</p>,
  },
  {
    heading: "4. Contact Us",
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Reel Purpose
          <br />
          reelpurpose.fishing
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalPage title="PRIVACY POLICY" sections={SECTIONS} />;
}
