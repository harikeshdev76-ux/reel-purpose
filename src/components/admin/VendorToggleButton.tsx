"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VendorToggleButton({
  vendorId,
  active,
}: {
  vendorId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/toggle`, {
        method: "POST",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={`ml-3 text-sm transition-opacity disabled:opacity-50 ${
        active ? "text-[#f87171]" : "text-[#4ade80]"
      }`}
    >
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}
