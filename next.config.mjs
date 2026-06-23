/** @type {import('next').NextConfig} */

// Allow next/image to load product photos served from the Cloudflare R2 public
// bucket. The host is derived from R2_PUBLIC_URL so no hostname is hard-coded.
const remotePatterns = [];
if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
    });
  } catch {
    // Invalid R2_PUBLIC_URL — leave remotePatterns empty; build still succeeds.
  }
}

const nextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
