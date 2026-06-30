"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING" | "FULFILLED" | "SHIPPED";

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "Mark as Pending", value: "PENDING" },
  { label: "Mark as Fulfilled", value: "FULFILLED" },
  { label: "Mark as Shipped", value: "SHIPPED" },
];

export default function VendorOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const update = async (status: Status) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/vendor/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Update Status
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {STATUS_OPTIONS.map((opt) => {
          const active = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={busy || active}
              onClick={() => void update(opt.value)}
              className={`rounded px-4 py-2.5 font-body text-sm transition-colors disabled:cursor-not-allowed ${
                active
                  ? "bg-[#c9a84c] text-[#0f1117]"
                  : "bg-[#222840] text-[#f0e6d3] hover:bg-[rgba(201,168,76,0.15)]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
