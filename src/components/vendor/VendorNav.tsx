"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";

export default function VendorNav({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VendorHeader onOpen={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <VendorSidebar
        userName={userName}
        userEmail={userEmail}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
