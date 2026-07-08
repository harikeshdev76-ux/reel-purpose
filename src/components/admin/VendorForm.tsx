"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INPUT_CLASS =
  "w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.3)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";

export default function VendorForm({
  vendor,
}: {
  vendor?: { id: string; name: string; email: string };
}) {
  const router = useRouter();
  const isEdit = Boolean(vendor);

  const [name, setName] = useState(vendor?.name ?? "");
  const [email, setEmail] = useState(vendor?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!name.trim()) return setError("Vendor name is required.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    // Create: password required. Edit: only validate when a new one is entered.
    if (!isEdit || password) {
      if (password.length < 8) {
        return setError("Password must be at least 8 characters.");
      }
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
    }

    setSaving(true);
    try {
      const body: { name: string; email: string; password?: string } = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };
      if (password) body.password = password;

      const res = await fetch(
        isEdit ? `/api/admin/vendors/${vendor!.id}` : "/api/admin/vendors",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        setSaving(false);
        return;
      }
      router.push("/admin/vendors?tab=accounts");
      router.refresh();
    } catch {
      setError("Save failed");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={LABEL_CLASS}>Vendor Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          {isEdit ? "New Password (leave blank to keep current)" : "Password *"}
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          {isEdit ? "Confirm New Password" : "Confirm Password *"}
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      {error && <p className="font-body text-sm text-[#f87171]">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded bg-[#c9a84c] px-6 py-2.5 font-condensed font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50"
      >
        {saving
          ? "Saving…"
          : isEdit
            ? "Save Changes"
            : "Create Vendor"}
      </button>
    </div>
  );
}
