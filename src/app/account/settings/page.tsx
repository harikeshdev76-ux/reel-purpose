import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountSettingsForm from "@/components/account/AccountSettingsForm";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    session.user?.role !== "customer" ||
    !session.user?.email
  ) {
    redirect("/account/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { email: session.user.email },
  });
  if (!customer) redirect("/account/login");

  const address =
    (customer.address as {
      line1?: string;
      city?: string;
      state?: string;
      zip?: string;
    } | null) ?? null;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/account"
          className="mb-4 inline-block font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
        >
          ← Back to Account
        </Link>
        <h1 className="mb-6 font-display text-4xl text-[#f0e6d3]">
          Account Settings
        </h1>

        <AccountSettingsForm
          initialName={customer.name}
          initialPhone={customer.phone ?? ""}
          initialAddress={{
            line1: address?.line1 ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            zip: address?.zip ?? "",
          }}
        />
      </div>
    </div>
  );
}
