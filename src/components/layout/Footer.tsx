import Link from "next/link";
import Image from "next/image";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "Apparel", href: "/shop?type=TSHIRT" },
      { label: "Hats", href: "/shop?type=HAT" },
    ],
  },
  {
    heading: "Company",
    links: [{ label: "Our Story", href: "/about" }],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[#0d1117]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center" aria-label="Reel Purpose home">
              <Image
                src="/Reel_purpose_Logo_Transparent_1.png"
                alt="Reel Purpose"
                width={120}
                height={88}
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
        <div className="mx-auto max-w-7xl px-6 py-3">
          <p className="font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.55)]">
            © {year} Reel Purpose · Florida Fishing Apparel
          </p>
        </div>
      </div>
    </footer>
  );
}
