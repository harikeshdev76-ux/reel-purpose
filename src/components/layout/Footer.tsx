import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Collections", href: "/shop" },
      { label: "Species", href: "/#species" },
      { label: "Apparel", href: "/shop?type=tshirt" },
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
            © {new Date().getFullYear()} Reel Purpose · Florida Fishing Apparel
          </p>
        </div>
      </div>
    </footer>
  );
}
