"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminNav({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdminHeader onOpen={() => setOpen(true)} />

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar
        userName={userName}
        userEmail={userEmail}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
