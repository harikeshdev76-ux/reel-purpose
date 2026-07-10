import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Reel Purpose",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Welcome",
    body: (
      <p>
        {`Welcome to Reel Purpose LLC ("Reel Purpose," "we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, process, and safeguard personal information when you visit https://reelpurpose.fishing (the "Site"), purchase products, create an account, subscribe to emails or SMS, participate in promotions, contact customer service, or otherwise interact with us.`}
      </p>
    ),
  },
  {
    heading: "2. Information We Collect",
    body: (
      <p>
        {`We may collect your name, email address, phone number, billing and shipping address, payment information (processed by secure third-party payment processors), order history, product preferences, account credentials, and communications with our customer service team. We also collect device information, browser information, IP address, shopping activity, pages visited, and cookie data.`}
      </p>
    ),
  },
  {
    heading: "3. How We Use Information",
    body: (
      <p>
        {`We use personal information to process orders, provide customer support, communicate order updates, send marketing communications (with your consent where required), personalize your shopping experience, improve our products and Website, prevent fraud, comply with legal obligations, and administer promotions.`}
      </p>
    ),
  },
  {
    heading: "4. Cookies & Analytics",
    body: (
      <p>
        {`We use cookies, pixels, and similar technologies to remember shopping carts, save preferences, improve Website performance, analyze visitor behavior, and provide relevant advertising. We may use providers such as Google Analytics, Meta Pixel, and similar services.`}
      </p>
    ),
  },
  {
    heading: "5. Sharing Information",
    body: (
      <p>
        {`We do not sell your personal information. We may share information with trusted service providers that assist with payment processing, shipping, order fulfillment, marketing, analytics, fraud prevention, accounting, and Website hosting. We may also disclose information when required by law or in connection with a business transaction.`}
      </p>
    ),
  },
  {
    heading: "6. Marketing",
    body: (
      <p>
        {`If you subscribe to our marketing emails or SMS messages, we may send information regarding new product launches, promotions, limited releases, fishing content, and company news. You may unsubscribe at any time.`}
      </p>
    ),
  },
  {
    heading: "7. Children",
    body: (
      <p>
        {`Our Website is intended for users age 18 or older. We do not knowingly collect personal information from children under 13.`}
      </p>
    ),
  },
  {
    heading: "8. Security",
    body: (
      <p>
        {`We maintain commercially reasonable administrative, technical, and physical safeguards to protect your personal information; however, no Internet transmission or electronic storage method is completely secure.`}
      </p>
    ),
  },
  {
    heading: "9. Your Rights",
    body: (
      <p>
        {`Depending on your location, you may have the right to access, correct, delete, or request a copy of your personal information, opt out of certain marketing communications, and exercise applicable privacy rights under state law.`}
      </p>
    ),
  },
  {
    heading: "10. Changes",
    body: (
      <p>
        {`We may update this Privacy Policy periodically. Updates become effective upon posting to the Website.`}
      </p>
    ),
  },
  {
    heading: "11. Contact",
    body: (
      <p className="whitespace-pre-line">
        {`Reel Purpose LLC
Website: https://reelpurpose.fishing
Privacy Email: privacy@reelpurpose.fishing`}
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="PRIVACY POLICY"
      dateLine="Effective Date: July 2026"
      sections={SECTIONS}
    />
  );
}
