import {
  PrismaClient,
  ContentType,
  ProductCategory,
  ProductType,
  Size,
  Species,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TSHIRT_SIZES: Size[] = [Size.S, Size.M, Size.L, Size.XL, Size.XXL];
const HAT_SIZES: Size[] = [Size.ONE_SIZE];

const TSHIRT_COLORS = ["WHITE", "SAND", "ICE_BLUE", "SILVER", "SALMON"];
const HAT_COLORS = ["NAVY", "WHITE", "BLACK"];

const TSHIRT_PRICE = 3800; // $38.00 in cents
const HAT_PRICE = 3200; // $32.00 in cents

// 12 placeholder products across the 5 active species (COMING_SOON excluded).
// First three (featured) are one tee per species: TARPON, SNOOK, REDFISH.
const products = [
  { name: "Tarpon Silhouette Tee", species: Species.TARPON, type: ProductType.TSHIRT, featured: true },
  { name: "Tarpon Strike Hat", species: Species.TARPON, type: ProductType.HAT, featured: false },
  { name: "Tarpon Sunset Tee", species: Species.TARPON, type: ProductType.TSHIRT, featured: false },
  { name: "Snook Ambush Tee", species: Species.SNOOK, type: ProductType.TSHIRT, featured: true },
  { name: "Snook Lineside Hat", species: Species.SNOOK, type: ProductType.HAT, featured: false },
  { name: "Snook Dawn Patrol Tee", species: Species.SNOOK, type: ProductType.TSHIRT, featured: false },
  { name: "Redfish Tail Tee", species: Species.REDFISH, type: ProductType.TSHIRT, featured: true },
  { name: "Redfish Marsh Hat", species: Species.REDFISH, type: ProductType.HAT, featured: false },
  { name: "Bluewater Tuna Tee", species: Species.TUNA_MAHI, type: ProductType.TSHIRT, featured: false },
  { name: "Mahi Offshore Hat", species: Species.TUNA_MAHI, type: ProductType.HAT, featured: false },
  { name: "Largemouth Bass Tee", species: Species.BASS, type: ProductType.TSHIRT, featured: false },
  { name: "Bass Lake Hat", species: Species.BASS, type: ProductType.HAT, featured: false },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Admin identities are read from env vars so no credentials are committed to git.
// Set ADMIN_<NAME>_EMAIL / ADMIN_<NAME>_PASSWORD in .env before running the seed.
// NOTE: launch credentials are still ⏳ pending confirmation from Mike — the values
// currently in .env are temporary local-dev placeholders. Re-seed with real values
// (and rotate these temp passwords) before going live.
const admins = [
  {
    name: "Mike",
    email: process.env.ADMIN_MIKE_EMAIL,
    password: process.env.ADMIN_MIKE_PASSWORD,
  },
  {
    name: "Luca",
    email: process.env.ADMIN_LUCA_EMAIL,
    password: process.env.ADMIN_LUCA_PASSWORD,
  },
];

// Editable site content. Defaults match the current hardcoded copy so the site
// looks identical after migration. Seeded with upsert (create-only) so admin
// edits are never overwritten on re-seed.
const SITE_CONTENT: {
  key: string;
  value: string;
  type: ContentType;
  label: string;
  section: string;
}[] = [
  // Homepage Hero
  { key: "hero.headline.line1", value: "FISHING", type: ContentType.TEXT, label: "Hero Headline Line 1", section: "Homepage Hero" },
  { key: "hero.headline.line2", value: "WITH", type: ContentType.TEXT, label: "Hero Headline Line 2", section: "Homepage Hero" },
  { key: "hero.headline.line3", value: "PURPOSE.", type: ContentType.TEXT, label: "Hero Headline Line 3 (Gold)", section: "Homepage Hero" },
  { key: "hero.subtext", value: "Built in Florida. Made for life.", type: ContentType.TEXT, label: "Hero Subtext", section: "Homepage Hero" },
  { key: "hero.cta.primary", value: "Shop Apparel", type: ContentType.TEXT, label: "Hero Primary CTA Label", section: "Homepage Hero" },
  { key: "hero.cta.secondary", value: "Our Story", type: ContentType.TEXT, label: "Hero Secondary CTA Label", section: "Homepage Hero" },
  { key: "hero.image", value: "/background_with_no_logo.png", type: ContentType.IMAGE, label: "Hero Background Image", section: "Homepage Hero" },

  // Homepage Collections
  { key: "collections.originals.eyebrow", value: "Reel Purpose Originals", type: ContentType.TEXT, label: "Originals Eyebrow", section: "Homepage Collections" },
  { key: "collections.originals.title", value: "THE ORIGINALS", type: ContentType.TEXT, label: "Originals Title", section: "Homepage Collections" },
  { key: "collections.originals.description", value: "The collection that started it all. Clean, timeless, and built for life on the water. The Originals Collection features our signature performance shirts and embroidered hats, designed for anglers who appreciate quality without the extra flash. Whether you're running offshore before sunrise, exploring the backwaters, or spending the day with family, these are the essentials you'll reach for every time.", type: ContentType.TEXT, label: "Originals Description", section: "Homepage Collections" },
  { key: "collections.originals.tagline", value: "Simple. Comfortable. Built with Purpose.", type: ContentType.TEXT, label: "Originals Tagline", section: "Homepage Collections" },
  { key: "collections.saltwater.title", value: "SALTWATER", type: ContentType.TEXT, label: "Saltwater Title", section: "Homepage Collections" },
  { key: "collections.saltwater.subtitle", value: "Chase the Tide", type: ContentType.TEXT, label: "Saltwater Subtitle", section: "Homepage Collections" },
  { key: "collections.saltwater.description", value: "From early morning tarpon runs to offshore adventures, our Saltwater Collection is built for anglers who live for the next cast.", type: ContentType.TEXT, label: "Saltwater Description", section: "Homepage Collections" },
  { key: "collections.freshwater.title", value: "FRESHWATER", type: ContentType.TEXT, label: "Freshwater Title", section: "Homepage Collections" },
  { key: "collections.freshwater.subtitle", value: "Where Every Cast Begins", type: ContentType.TEXT, label: "Freshwater Subtitle", section: "Homepage Collections" },
  { key: "collections.freshwater.description", value: "Whether you're chasing bass at sunrise or spending weekends on your favorite lake, our Freshwater Collection celebrates the places where memories are made.", type: ContentType.TEXT, label: "Freshwater Description", section: "Homepage Collections" },
  { key: "collections.originals.image", value: "/Reel-purpose-originals.jpeg", type: ContentType.IMAGE, label: "Originals Collection Image", section: "Homepage Collections" },
  { key: "collections.saltwater.image", value: "", type: ContentType.IMAGE, label: "Saltwater Collection Image", section: "Homepage Collections" },
  { key: "collections.freshwater.image", value: "", type: ContentType.IMAGE, label: "Freshwater Collection Image", section: "Homepage Collections" },

  // Homepage Purpose
  { key: "purpose.headline.line1", value: "MORE THAN FISHING.", type: ContentType.TEXT, label: "Purpose Headline Line 1", section: "Homepage Purpose" },
  { key: "purpose.headline.line2", value: "IT'S A PURPOSE.", type: ContentType.TEXT, label: "Purpose Headline Line 2 (Gold)", section: "Homepage Purpose" },
  { key: "purpose.body", value: "Fishing isn't just about catching fish.\n\nIt's about slowing down.\nIt's about sunrise conversations.\nIt's about learning patience.\nIt's about respecting God's creation.\nIt's about teaching the next generation.\n\nAt Reel Purpose, we believe every trip on the water is an opportunity to build stronger families, stronger faith, and unforgettable memories.\n\nThat's why every design we create represents something bigger than apparel.\n\nIt represents a life lived with purpose.", type: ContentType.TEXT, label: "Purpose Body Copy", section: "Homepage Purpose" },
  { key: "purpose.scripture", value: "Then He said to them, Follow Me, and I will make you fishers of men.", type: ContentType.TEXT, label: "Scripture Quote", section: "Homepage Purpose" },
  { key: "purpose.scripture.attribution", value: "Matthew 4:19", type: ContentType.TEXT, label: "Scripture Attribution", section: "Homepage Purpose" },

  // Homepage Values
  { key: "values.faith.title", value: "Faith", type: ContentType.TEXT, label: "Faith Title", section: "Homepage Values" },
  { key: "values.faith.description", value: "We believe every sunrise on the water is a reminder of God's incredible creation.", type: ContentType.TEXT, label: "Faith Description", section: "Homepage Values" },
  { key: "values.family.title", value: "Family", type: ContentType.TEXT, label: "Family Title", section: "Homepage Values" },
  { key: "values.family.description", value: "Some of life's greatest conversations happen in a boat before daylight.", type: ContentType.TEXT, label: "Family Description", section: "Homepage Values" },
  { key: "values.adventure.title", value: "Adventure", type: ContentType.TEXT, label: "Adventure Title", section: "Homepage Values" },
  { key: "values.adventure.description", value: "Every trip brings new memories, new places, and new stories to tell.", type: ContentType.TEXT, label: "Adventure Description", section: "Homepage Values" },
  { key: "values.conservation.title", value: "Conservation", type: ContentType.TEXT, label: "Conservation Title", section: "Homepage Values" },
  { key: "values.conservation.description", value: "We believe protecting our fisheries today ensures future generations can enjoy them tomorrow.", type: ContentType.TEXT, label: "Conservation Description", section: "Homepage Values" },
  { key: "values.community.title", value: "Community", type: ContentType.TEXT, label: "Community Title", section: "Homepage Values" },
  { key: "values.community.description", value: "Fishing brings people together. We're proud to be part of a growing community that shares a passion for the outdoors.", type: ContentType.TEXT, label: "Community Description", section: "Homepage Values" },

  // Homepage Newsletter
  { key: "newsletter.eyebrow", value: "Join The Crew", type: ContentType.TEXT, label: "Newsletter Eyebrow", section: "Homepage Newsletter" },
  { key: "newsletter.headline", value: "Join The Crew", type: ContentType.TEXT, label: "Newsletter Headline", section: "Homepage Newsletter" },
  { key: "newsletter.subtext", value: "Get exclusive product launches, fishing stories, giveaways, and early access to limited-edition collections.", type: ContentType.TEXT, label: "Newsletter Subtext", section: "Homepage Newsletter" },
  { key: "newsletter.button", value: "Join the Crew →", type: ContentType.TEXT, label: "Newsletter Button Label", section: "Homepage Newsletter" },

  // About Page
  { key: "about.title", value: "Meet Luca", type: ContentType.TEXT, label: "About Page Title", section: "About Page" },
  { key: "about.subtitle", value: "Founder, Reel Purpose", type: ContentType.TEXT, label: "About Page Subtitle", section: "About Page" },
  { key: "about.body", value: "Hi, I'm Luca.\n\nI grew up in Florida where some of my greatest memories were made fishing.\n\nThose mornings taught me lessons that had nothing to do with catching fish.\n\nThey taught me patience.\nHard work.\nFaith.\nRespect for nature.\nAnd how valuable time with family truly is.\n\nReel Purpose was created because I wanted a brand that represents everything fishing has given me—not just the excitement of the catch, but the people beside me and the memories we'll never forget.\n\nEvery shirt, every hat, and every design reminds us that life is about much more than fishing.\n\nIt's about living with purpose.\n\nThank you for being part of our journey.\nSee you on the water.", type: ContentType.TEXT, label: "About Page Body", section: "About Page" },
  { key: "about.tagline", value: "More than fishing. It's a purpose. 🎣🌊", type: ContentType.TEXT, label: "About Page Tagline", section: "About Page" },
  { key: "about.image", value: "/ourstory.jpeg", type: ContentType.IMAGE, label: "About Page Photo", section: "About Page" },

  // Product Page
  { key: "product.brand.title", value: "Built to Perform. Designed to Last.", type: ContentType.TEXT, label: "Product Brand Block Title", section: "Product Page" },
  { key: "product.brand.description", value: "Whether you're casting inshore, running offshore, or relaxing at the dock, every Reel Purpose product is built with comfort, durability, and performance in mind.", type: ContentType.TEXT, label: "Product Brand Description", section: "Product Page" },
  { key: "product.brand.features", value: "Designed in Florida\nPremium Materials\nLightweight & Breathable\nMoisture-Wicking Performance\nBuilt for Saltwater & Freshwater\nEveryday Comfort\nMade to Last", type: ContentType.TEXT, label: "Product Features List (one per line)", section: "Product Page" },

  // Footer
  { key: "footer.tagline", value: "Built In Florida. Made For Life.", type: ContentType.TEXT, label: "Footer Tagline", section: "Footer" },
  { key: "footer.description", value: "Premium fishing apparel inspired by faith, family, and the pursuit of unforgettable days on the water.", type: ContentType.TEXT, label: "Footer Brand Description", section: "Footer" },

  // Legal Pages
  { key: "legal.privacy.effectiveDate", value: "Effective Date: July 2026", type: ContentType.TEXT, label: "Privacy Policy Effective Date", section: "Legal Pages" },
  {
    key: "legal.privacy.content",
    type: ContentType.TEXT,
    label: "Privacy Policy Content (Use ## Heading for section titles, blank line between paragraphs)",
    section: "Legal Pages",
    value: `## Welcome
Welcome to Reel Purpose LLC ("Reel Purpose," "we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, process, and safeguard personal information when you visit https://reelpurpose.fishing (the "Site"), purchase products, create an account, subscribe to emails or SMS, participate in promotions, contact customer service, or otherwise interact with us.

## Information We Collect
We may collect your name, email address, phone number, billing and shipping address, payment information (processed by secure third-party payment processors), order history, product preferences, account credentials, and communications with our customer service team. We also collect device information, browser information, IP address, shopping activity, pages visited, and cookie data.

## How We Use Information
We use personal information to process orders, provide customer support, communicate order updates, send marketing communications (with your consent where required), personalize your shopping experience, improve our products and Website, prevent fraud, comply with legal obligations, and administer promotions.

## Cookies & Analytics
We use cookies, pixels, and similar technologies to remember shopping carts, save preferences, improve Website performance, analyze visitor behavior, and provide relevant advertising. We may use providers such as Google Analytics, Meta Pixel, and similar services.

## Sharing Information
We do not sell your personal information. We may share information with trusted service providers that assist with payment processing, shipping, order fulfillment, marketing, analytics, fraud prevention, accounting, and Website hosting. We may also disclose information when required by law or in connection with a business transaction.

## Marketing
If you subscribe to our marketing emails or SMS messages, we may send information regarding new product launches, promotions, limited releases, fishing content, and company news. You may unsubscribe at any time.

## Children
Our Website is intended for users age 18 or older. We do not knowingly collect personal information from children under 13.

## Security
We maintain commercially reasonable administrative, technical, and physical safeguards to protect your personal information; however, no Internet transmission or electronic storage method is completely secure.

## Your Rights
Depending on your location, you may have the right to access, correct, delete, or request a copy of your personal information, opt out of certain marketing communications, and exercise applicable privacy rights under state law.

## Changes
We may update this Privacy Policy periodically. Updates become effective upon posting to the Website.

## Contact
Reel Purpose LLC
Website: https://reelpurpose.fishing
Privacy Email: privacy@reelpurpose.fishing`,
  },
  { key: "legal.terms.effectiveDate", value: "Last Updated: July 2026", type: ContentType.TEXT, label: "Terms of Service Effective Date", section: "Legal Pages" },
  {
    key: "legal.terms.content",
    type: ContentType.TEXT,
    label: "Terms of Service Content (Use ## Heading for section titles, blank line between paragraphs)",
    section: "Legal Pages",
    value: `## Overview
These Terms & Conditions ("Terms") govern your use of https://reelpurpose.fishing (the "Website") and any products or services offered by Reel Purpose LLC ("Reel Purpose," "we," "our," or "us"). To place an order, you must affirmatively accept these Terms at checkout by checking an unchecked-by-default box indicating your agreement. By checking that box and placing an order, you agree that these Terms (including any dispute resolution and limitation of liability provisions), our Privacy Policy, Shipping Policy, Return Policy, and any other posted policies are enforceable and apply to your order and use of the Website.

## Product Descriptions
We strive to accurately describe our fishing apparel, hats, and accessories. Colors, images, sizing, and product availability may vary slightly depending on your device and manufacturing updates. We reserve the right to correct typographical, technical, photographic, or listing errors and to modify products, pricing, and specifications without notice.

## Orders
All orders are offers and are subject to acceptance and availability. We reserve the right to refuse or cancel orders, limit quantities, correct errors, or suspend access to the Website, including for suspected fraud, unauthorized transactions, promotion abuse, excessive returns, suspected resale activity, policy violations, or other misuse, including after an order has been confirmed and/or your payment method has been charged. If you have been charged and we issue a refund, the refund will be made to the original payment method.

## Billing & Payment
All prices are in U.S. Dollars. Payments are securely processed through third-party payment providers such as Stripe or other approved processors. Applicable sales tax will be collected where required by law.

## Shipping, Returns & Exchanges
If you have any issue with a product, your sole and exclusive remedy is, at Reel Purpose's option, replacement of the product or a refund of the amount you paid. Shipping estimates are not guaranteed. Title and risk of loss pass to you upon our tender of the products to the carrier. You are responsible for providing an accurate shipping address. Please refer to our Shipping Policy and Return & Exchange Policy for complete details.

## Warranty Disclaimer
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

## Intellectual Property
All Reel Purpose names, logos, artwork, apparel designs, product photography, graphics, text, and Website content are the exclusive property of Reel Purpose LLC and may not be copied, reproduced, distributed, or used without prior written permission.

## Website Use
You are granted a limited, non-exclusive license to use the Website for personal, non-commercial purposes. You may not copy, scrape, reverse engineer, or misuse the Website or its content.

## User Content
If you submit reviews, photos, fishing stories, or other content, you grant Reel Purpose LLC a non-exclusive, worldwide, perpetual, royalty-free license to use, reproduce, modify, distribute, and publicly display that content for marketing and business purposes, while you retain ownership of your original content. Reel Purpose LLC may remove or moderate any content at any time in its sole discretion.

## Indemnification
You agree to indemnify, defend, and hold harmless Reel Purpose LLC and its affiliates from and against any third-party claims arising out of your use of the Website, your violation of these Terms, or your User Content.

## Limitation of Liability
To the maximum extent permitted by law, Reel Purpose LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Website or any products. Reel Purpose LLC's total liability for any claim shall not exceed the amount actually paid by you for the product(s) giving rise to the claim.

## Disclaimer
The Website and all content are provided "AS IS" and "AS AVAILABLE." We do not guarantee uninterrupted or error-free operation.

## Children
The Website is intended for individuals 18 years of age or older or those using the Website with parental or guardian supervision.

## Governing Law
These Terms shall be governed by the laws of the State of Florida, without regard to conflict of law principles.

## Dispute Resolution
Before initiating arbitration, you and Reel Purpose LLC agree to first provide written notice and attempt in good faith to resolve the dispute for at least thirty (30) days. Any dispute will be resolved by binding individual arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, and not in court, except that either party may bring an individual action in small claims court if the claim qualifies. YOU AND REEL PURPOSE LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.

## Changes
We may modify these Terms at any time by posting updated versions on the Website. Each order is governed by the version of the Terms in effect at checkout.

## Contact
Reel Purpose LLC
Website: https://reelpurpose.fishing
General: reelpurpose@outlook.com
Legal/Privacy: privacy@reelpurpose.fishing`,
  },
  { key: "legal.cookies.effectiveDate", value: "Last updated: July 2026", type: ContentType.TEXT, label: "Cookie Policy Effective Date", section: "Legal Pages" },
  {
    key: "legal.cookies.content",
    type: ContentType.TEXT,
    label: "Cookie Policy Content (Use ## Heading for section titles, blank line between paragraphs)",
    section: "Legal Pages",
    value: `## What Are Cookies
Cookies are small text files stored on your device when you visit our website.

## How We Use Cookies
We use cookies to:
• Remember your preferences
• Keep you signed in to your account
• Understand how you use our site to improve your experience

## Managing Cookies
You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our site.

## Contact Us
For questions about our Cookie Policy, contact us at reelpurpose.fishing`,
  },
];

async function main() {
  for (const admin of admins) {
    if (!admin.email || !admin.password) {
      const key = admin.name.toUpperCase();
      throw new Error(
        `Missing credentials for ${admin.name}. Set ADMIN_${key}_EMAIL and ADMIN_${key}_PASSWORD in .env`,
      );
    }

    const hashedPassword = await bcrypt.hash(admin.password, 12);

    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: { name: admin.name, password: hashedPassword },
      create: { name: admin.name, email: admin.email, password: hashedPassword },
    });

    console.log(`Seeded admin: ${admin.name} <${admin.email}>`);
  }

  // Vendor identity is read from env vars (same pattern as admins) so no
  // credential is committed to git. Set VENDOR_EMAIL / VENDOR_PASSWORD in .env.
  // Skipped (not fatal) when unset so product/admin seeding still succeeds.
  const vendorEmail = process.env.VENDOR_EMAIL;
  const vendorPassword = process.env.VENDOR_PASSWORD;
  if (vendorEmail && vendorPassword) {
    const hashedVendorPassword = await bcrypt.hash(vendorPassword, 12);
    await prisma.vendor.upsert({
      where: { email: vendorEmail },
      update: { name: "Vendor", password: hashedVendorPassword, active: true },
      create: {
        name: "Vendor",
        email: vendorEmail,
        password: hashedVendorPassword,
        active: true,
      },
    });
    console.log(`Seeded vendor: <${vendorEmail}>`);
  } else {
    console.warn(
      "Skipped vendor seed — set VENDOR_EMAIL and VENDOR_PASSWORD in .env to seed the vendor.",
    );
  }

  for (const product of products) {
    const isTee = product.type === ProductType.TSHIRT;
    const slug = slugify(product.name);
    const data = {
      name: product.name,
      slug,
      description: isTee
        ? "Premium cotton blend tee with a species-inspired graphic. Built for life on the water."
        : "Structured, breathable cap with an embroidered species mark. Made for the tide.",
      species: product.species,
      type: product.type,
      // Current seeded products are the starter collection.
      category: ProductCategory.ORIGINALS,
      price: isTee ? TSHIRT_PRICE : HAT_PRICE,
      sizes: isTee ? TSHIRT_SIZES : HAT_SIZES,
      colors: isTee ? TSHIRT_COLORS : HAT_COLORS,
      imageUrl: "/placeholder-product.jpg",
      featured: product.featured,
      active: true,
    };

    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: data,
    });

    console.log(`Seeded product: ${product.name} (${slug})`);
  }

  // Site content — create only, so admin edits survive re-seeds.
  for (const item of SITE_CONTENT) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log(`Seeded ${SITE_CONTENT.length} site content keys`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
