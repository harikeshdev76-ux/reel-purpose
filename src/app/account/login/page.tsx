"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const INPUT_CLASS =
  "w-full rounded border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.05)] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.35)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      return setError("Please enter your email and password.");
    }

    setSubmitting(true);
    const result = await signIn("customer-credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setSubmitting(false);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6 py-12">
      <div className="w-full max-w-md rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-8">
        <Image
          src="/Reel_purpose_Logo_Transparent_1.png"
          alt="Reel Purpose"
          width={120}
          height={92}
          className="mx-auto mb-6"
        />
        <h1 className="mb-6 text-center font-display text-3xl text-[#f0e6d3]">
          Sign In
        </h1>

        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSubmit();
              }}
              className={INPUT_CLASS}
            />
          </div>

          {error && <p className="font-body text-sm text-[#f87171]">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded bg-[#c9a84c] py-2.5 font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] disabled:opacity-70"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <p className="mt-4 text-center font-body text-sm text-[rgba(240,230,211,0.5)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/register"
            className="text-[#c9a84c] hover:underline"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
