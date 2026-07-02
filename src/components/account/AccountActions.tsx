"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

const LINK_CLASS =
  "flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] py-2 font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.7)] transition-colors hover:text-[#c9a84c]";

export default function AccountActions() {
  return (
    <div className="rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-5">
      <p className="mb-4 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Account
      </p>

      <Link href="/account/orders" className={LINK_CLASS}>
        Order History
      </Link>
      <Link href="/account/settings" className={LINK_CLASS}>
        Account Settings
      </Link>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className={`${LINK_CLASS} w-full text-left`}
      >
        Sign Out
      </button>
    </div>
  );
}
