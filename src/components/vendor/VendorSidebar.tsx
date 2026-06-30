"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

type NavItem = { label: string; href: string; icon: ReactNode };

const ICON_PROPS = {
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.6,
  stroke: "currentColor",
  className: "h-5 w-5 shrink-0",
} as const;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Orders",
    href: "/vendor/dashboard",
    icon: (
      <svg {...ICON_PROPS}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/vendor/products",
    icon: (
      <svg {...ICON_PROPS}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
];

export default function VendorSidebar({
  userName,
  userEmail,
  isOpen,
  onClose,
}: {
  userName: string;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] transition-transform duration-200 lg:w-64 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-5">
        <Image
          src="/Reel_purpose_Logo_Transparent_1.png"
          alt="Reel Purpose"
          width={44}
          height={34}
        />
        <span className="font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
          Vendor Panel
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`mx-2 flex items-center gap-3 rounded-md px-4 py-2.5 font-body text-sm transition-colors ${
                active
                  ? "border-l-2 border-[#c9a84c] bg-[rgba(201,168,76,0.15)] text-[#c9a84c]"
                  : "border-l-2 border-transparent text-[rgba(240,230,211,0.6)] hover:bg-[rgba(201,168,76,0.1)] hover:text-[#f0e6d3]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[rgba(255,255,255,0.08)] px-5 py-4">
        <p className="truncate font-body text-xs text-[rgba(240,230,211,0.4)]">
          {userName}
          {userEmail ? ` · ${userEmail}` : ""}
        </p>
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/vendor" })}
          className="mt-2 font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#f87171]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
