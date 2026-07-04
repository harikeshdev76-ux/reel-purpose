"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rp-cookies-accepted";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setAccepted(true);
    }
  }, []);

  // Don't render on the server or before mount (avoids SSR hydration mismatch),
  // and hide once accepted.
  if (!mounted || accepted) return null;

  function accept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setAccepted(true);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 translate-y-0 border-t border-[rgba(201,168,76,0.2)] bg-[rgba(13,17,23,0.97)] px-6 py-4 opacity-100 backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="font-body text-sm text-[rgba(240,230,211,0.7)]">
          We use cookies to improve your experience on our site.{" "}
          <Link href="/privacy" className="text-[#c9a84c] hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/cookies" className="text-[#c9a84c] hover:underline">
            Cookie Policy
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={accept}
            className="rounded bg-[#c9a84c] px-5 py-2 font-condensed text-sm font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
