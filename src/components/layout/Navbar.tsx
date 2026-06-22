"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/about" },
];

export default function Navbar() {
  const { totalItems: cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full overflow-visible bg-[rgba(13,17,23,0.92)] backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between overflow-visible px-6">
        {/* Logo — intentionally overflows the slim bar above and below */}
        <Link href="/" className="flex items-center" aria-label="Reel Purpose home">
          <Image
            src="/Reel_purpose_Logo_Transparent_1.png"
            alt="Reel Purpose"
            width={150}
            height={110}
            priority
            className="mb-[-27px] mt-[-27px]"
          />
        </Link>

        {/* Desktop nav links + CTA + cart */}
        <div className="flex h-14 items-center gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.65)] transition-colors hover:text-[#c9a84c]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/shop"
            className="hidden rounded-full bg-[#c9a84c] px-6 py-2 font-condensed text-sm font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] md:inline-block"
          >
            Shop Now
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-[#c9a84c] transition-colors hover:text-[#b8952e]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-.534 1.872-1.79 1.872-3.052a3 3 0 0 0-.872-2.122l-.766-2.873M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a84c] font-condensed text-xs font-bold text-[#0d1117]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-[#f0e6d3] md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18 18 6M6 6l12 12"
                    : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[rgba(201,168,76,0.25)] md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.65)] transition-colors hover:text-[#c9a84c]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-full bg-[#c9a84c] px-6 py-2 text-center font-condensed text-sm font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e]"
              >
                Shop Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
