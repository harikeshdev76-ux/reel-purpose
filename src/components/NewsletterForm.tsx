"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "already" | "error";

export default function NewsletterForm({
  buttonLabel = "Join the Crew →",
}: {
  buttonLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (res.status === 201) {
        setStatus("success");
      } else if (res.status === 200) {
        // Already subscribed — friendly, not an error
        setStatus("already");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="font-condensed uppercase tracking-widest text-[#4ade80]">
        🎣 You&apos;re on the list!
      </p>
    );
  }

  if (status === "already") {
    return (
      <p className="font-condensed uppercase tracking-widest text-[#c9a84c]">
        You&apos;re already subscribed!
      </p>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          aria-label="Email Address"
          className="flex-1 rounded border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.35)] focus:border-[#c9a84c] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="whitespace-nowrap rounded bg-[#c9a84c] px-6 py-3 font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] disabled:opacity-70"
        >
          {loading ? "Subscribing..." : buttonLabel}
        </button>
      </div>
      {status === "error" && errorMsg ? (
        <p className="mt-2 text-sm text-[#f87171]">{errorMsg}</p>
      ) : null}
    </form>
  );
}
