"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Collections", href: "/shop" },
      { label: "Species", href: "/#species" },
      { label: "Apparel", href: "/shop?type=TSHIRT" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const year = new Date().getFullYear();

  if (isHome) {
    return (
      <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center" aria-label="Reel Purpose home">
                <Image
                  src="/Reel_purpose_Logo_Transparent_1.png"
                  alt="Reel Purpose"
                  width={180}
                  height={52}
                  className="h-[52px] w-auto"
                />
              </Link>
              <p className="mt-3 font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.55)]">
                Built In Florida. Made For Life.
              </p>
            </div>

            {/* Nav columns */}
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="font-condensed text-sm font-bold uppercase tracking-widest text-[#f0e6d3]">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-condensed text-sm uppercase tracking-wide text-[rgba(240,230,211,0.55)] transition-colors hover:text-[#c9a84c]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(201,168,76,0.15)]">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <p className="font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.55)]">
              © {year} Reel Purpose · Florida Fishing Apparel
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // ─────────── Marshland mode (all non-homepage pages) ───────────
  return (
    <footer className="bg-brand-navBg">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl tracking-wide text-brand-textOnDark"
            >
              REEL <span className="text-brand-rust">PURPOSE</span>
            </Link>
            <p className="mt-3 font-condensed text-sm uppercase tracking-widest text-brand-textOnDark/45">
              Built For The Tide
            </p>
          </div>

          {/* Nav columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="font-condensed text-sm font-bold uppercase tracking-widest text-brand-textOnDark">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-condensed text-sm uppercase tracking-wide text-brand-textOnDark/45 transition-colors hover:text-brand-textOnDark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-borderOnDark">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="font-condensed text-xs uppercase tracking-widest text-brand-textOnDark/45">
            © {year} Reel Purpose · Florida Fishing Apparel
          </p>
        </div>
      </div>
    </footer>
  );
}
