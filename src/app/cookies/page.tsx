import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — Reel Purpose",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. What Are Cookies",
    body: (
      <p>
        Cookies are small text files stored on your device when you visit our
        website.
      </p>
    ),
  },
  {
    heading: "2. How We Use Cookies",
    body: (
      <>
        <p>We use cookies to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Remember your preferences</li>
          <li>Keep you signed in to your account</li>
          <li>Understand how you use our site to improve your experience</li>
        </ul>
      </>
    ),
  },
  {
    heading: "3. Managing Cookies",
    body: (
      <p>
        You can control cookies through your browser settings. Note that
        disabling cookies may affect the functionality of our site.
      </p>
    ),
  },
  {
    heading: "4. Contact Us",
    body: (
      <p>
        For questions about our Cookie Policy, contact us at reelpurpose.fishing
      </p>
    ),
  },
];

export default function CookiesPage() {
  return <LegalPage title="COOKIE POLICY" sections={SECTIONS} />;
}
