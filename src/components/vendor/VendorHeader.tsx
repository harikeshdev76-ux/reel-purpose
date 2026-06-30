"use client";

import Image from "next/image";

export default function VendorHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] px-4 lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpen}
        className="text-[#f0e6d3]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
          />
        </svg>
      </button>

      <span className="font-condensed text-sm uppercase tracking-widest text-[#c9a84c]">
        Vendor Panel
      </span>

      <Image
        src="/Reel_purpose_Logo_Transparent_1.png"
        alt="Reel Purpose"
        width={80}
        height={60}
      />
    </header>
  );
}
