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
