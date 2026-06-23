"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING" | "FULFILLED" | "SHIPPED";

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "Mark as Pending", value: "PENDING" },
  { label: "Mark as Fulfilled", value: "FULFILLED" },
  { label: "Mark as Shipped", value: "SHIPPED" },
];

export default function OrderActions({
  orderId,
  currentStatus,
  vendorPaid,
  vendorCost,
}: {
  orderId: string;
  currentStatus: Status;
  vendorPaid: boolean;
  vendorCost: number | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [costInput, setCostInput] = useState(
    vendorCost != null ? (vendorCost / 100).toFixed(2) : "",
  );

  const post = async (url: string, body?: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const saveCost = () => {
    const dollars = parseFloat(costInput);
    if (Number.isNaN(dollars) || dollars < 0) return;
    void post(`/api/admin/orders/${orderId}/vendor-cost`, {
      vendorCost: Math.round(dollars * 100),
    });
  };

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
      {/* Status */}
      <p className="font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Update Status
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const active = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={busy || active}
              onClick={() =>
                void post(`/api/admin/orders/${orderId}/status`, {
                  status: opt.value,
                })
              }
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

      {/* Vendor payment */}
      <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Vendor Payment
      </p>
      <div className="mt-3">
        {vendorPaid ? (
          <p className="font-body text-sm text-[#4ade80]">Paid to vendor ✓</p>
        ) : (
          <>
            <p className="font-body text-sm text-[#fb923c]">
              Not yet paid to vendor
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post(`/api/admin/orders/${orderId}/vendor-paid`)
              }
              className="mt-2 rounded bg-[#4ade80] px-4 py-2 font-condensed text-xs font-bold uppercase tracking-widest text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Mark as Paid to Vendor
            </button>
          </>
        )}
      </div>

      {/* Vendor cost */}
      <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Vendor Cost
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-3">
          <span className="font-body text-sm text-[rgba(240,230,211,0.4)]">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costInput}
            onChange={(e) => setCostInput(e.target.value)}
            placeholder="0.00"
            className="w-28 bg-transparent py-2 pl-1 font-body text-sm text-[#f0e6d3] focus:outline-none"
          />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={saveCost}
          className="rounded bg-[#c9a84c] px-4 py-2 font-condensed text-xs font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
