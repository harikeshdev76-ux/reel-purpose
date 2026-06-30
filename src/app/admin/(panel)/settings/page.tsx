"use client";

import { useState } from "react";

const INPUT_CLASS =
  "w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.3)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">Settings</h1>

      <div className="max-w-md rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
        <h2 className="mb-4 font-display text-xl text-[#f0e6d3]">
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Current Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>New Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Confirm New Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSubmit();
              }}
              className={INPUT_CLASS}
            />
          </div>

          {error && <p className="font-body text-sm text-[#f87171]">{error}</p>}
          {success && (
            <p className="font-body text-sm text-[#4ade80]">
              ✓ Password updated
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded bg-[#c9a84c] px-6 py-2.5 font-condensed font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50"
          >
            {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
