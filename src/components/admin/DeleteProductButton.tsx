"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  productId,
  redirectTo,
  label = "Delete",
  className,
}: {
  productId: string;
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (
      !window.confirm(
        "Delete this product? It will be hidden from the store, but existing order history is preserved.",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={
        className ??
        "font-body text-sm text-[#f87171] transition-opacity hover:opacity-80 disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}
