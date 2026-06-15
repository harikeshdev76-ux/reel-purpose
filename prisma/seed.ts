import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
