"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorStockToggle({
  productId,
  inStock,
}: {
  productId: string;
  inStock: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/vendor/products/${productId}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !inStock }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={`rounded px-3 py-1 font-condensed text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 ${
        inStock
          ? "bg-[rgba(248,113,113,0.15)] text-[#f87171]"
          : "bg-[rgba(74,222,128,0.15)] text-[#4ade80]"
      }`}
    >
      {inStock ? "Mark Out of Stock" : "Mark In Stock"}
    </button>
  );
}
