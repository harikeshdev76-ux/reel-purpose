"use client";

import { useState } from "react";

const INPUT_CLASS =
  "w-full rounded border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.05)] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.35)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";
const CARD_CLASS =
  "rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6";
const BTN_CLASS =
  "rounded bg-[#c9a84c] px-6 py-2.5 font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] disabled:opacity-70";
const H2_CLASS = "mb-4 font-display text-xl text-[#f0e6d3]";

type Address = { line1: string; city: string; state: string; zip: string };
type Msg = { ok: boolean; text: string } | null;

function Feedback({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p
      className={`font-body text-sm ${msg.ok ? "text-[#4ade80]" : "text-[#f87171]"}`}
    >
      {msg.text}
    </p>
  );
}

export default function AccountSettingsForm({
  initialName,
  initialPhone,
  initialAddress,
}: {
  initialName: string;
  initialPhone: string;
  initialAddress: Address;
}) {
  // Section 1 — Personal Info
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<Msg>(null);

  // Section 2 — Saved Address
  const [addr, setAddr] = useState<Address>(initialAddress);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrMsg, setAddrMsg] = useState<Msg>(null);

  // Section 3 — Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<Msg>(null);

  async function saveProfile() {
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ ok: false, text: "Name is required." });
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");
      setProfileMsg({ ok: true, text: "✓ Saved" });
    } catch (e) {
      setProfileMsg({
        ok: false,
        text: e instanceof Error ? e.message : "Failed to save.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveAddress() {
    setAddrMsg(null);
    setSavingAddr(true);
    try {
      const res = await fetch("/api/account/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addr),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save address.");
      setAddrMsg({ ok: true, text: "✓ Address saved" });
    } catch (e) {
      setAddrMsg({
        ok: false,
        text: e instanceof Error ? e.message : "Failed to save address.",
      });
    } finally {
      setSavingAddr(false);
    }
  }

  async function savePassword() {
    setPwdMsg(null);
    if (newPassword.length < 8) {
      setPwdMsg({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setSavingPwd(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to update password.");
      setPwdMsg({ ok: true, text: "✓ Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPwdMsg({
        ok: false,
        text: e instanceof Error ? e.message : "Failed to update password.",
      });
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Section 1 — Personal Information */}
      <section className={CARD_CLASS}>
        <h2 className={H2_CLASS}>Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <Feedback msg={profileMsg} />
          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile}
            className={BTN_CLASS}
          >
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Section 2 — Default Shipping Address */}
      <section className={CARD_CLASS}>
        <h2 className={H2_CLASS}>Default Shipping Address</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Address Line 1</label>
            <input
              type="text"
              value={addr.line1}
              onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className={LABEL_CLASS}>City</label>
              <input
                type="text"
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>State</label>
              <input
                type="text"
                value={addr.state}
                onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>ZIP</label>
              <input
                type="text"
                value={addr.zip}
                onChange={(e) => setAddr({ ...addr, zip: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <Feedback msg={addrMsg} />
          <button
            type="button"
            onClick={saveAddress}
            disabled={savingAddr}
            className={BTN_CLASS}
          >
            {savingAddr ? "Saving…" : "Save Address"}
          </button>
        </div>
      </section>

      {/* Section 3 — Change Password */}
      <section className={CARD_CLASS}>
        <h2 className={H2_CLASS}>Change Password</h2>
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
                if (e.key === "Enter") void savePassword();
              }}
              className={INPUT_CLASS}
            />
          </div>
          <Feedback msg={pwdMsg} />
          <button
            type="button"
            onClick={savePassword}
            disabled={savingPwd}
            className={BTN_CLASS}
          >
            {savingPwd ? "Updating…" : "Update Password"}
          </button>
        </div>
      </section>
    </div>
  );
}
