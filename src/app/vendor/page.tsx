"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(false);
    setLoading(true);
    const res = await signIn("vendor-credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/vendor/dashboard");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4">
      <div className="w-full max-w-sm rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-8">
        <div className="mb-6 flex justify-center">
          <Image
            src="/Reel_purpose_Logo_Transparent_1.png"
            alt="Reel Purpose"
            width={120}
            height={92}
          />
        </div>

        <h1 className="text-center font-display text-3xl text-[#f0e6d3]">
          Vendor Login
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.3)] focus:border-[#c9a84c] focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSignIn();
            }}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.3)] focus:border-[#c9a84c] focus:outline-none"
          />

          {error && (
            <p className="text-center text-sm text-[#f87171]">
              Invalid email or password
            </p>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="mt-1 w-full rounded bg-[#c9a84c] py-2.5 font-body font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}
