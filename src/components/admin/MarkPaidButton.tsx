"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkPaidButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/vendor-paid`, {
        method: "POST",
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
      onClick={onClick}
      className="rounded bg-[#4ade80] px-3 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      Mark Paid
    </button>
  );
}
