"use client";

import { useRouter } from "next/navigation";

const TABS = [
  { label: "Payment Tracking", value: "payments" },
  { label: "Vendor Accounts", value: "accounts" },
];

export default function VendorTabs({ active }: { active: string }) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() =>
            router.push(
              tab.value === "payments"
                ? "/admin/vendors"
                : `/admin/vendors?tab=${tab.value}`,
            )
          }
          className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
            active === tab.value
              ? "bg-[#c9a84c] text-[#0f1117]"
              : "border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] text-[rgba(240,230,211,0.6)] hover:text-[#f0e6d3]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
