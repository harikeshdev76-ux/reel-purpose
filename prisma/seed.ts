import {
  PrismaClient,
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
