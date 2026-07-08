import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VendorForm from "@/components/admin/VendorForm";

export default async function EditVendorPage({
  params,
}: {
  params: { id: string };
}) {
  const vendor = await prisma.vendor.findUnique({ where: { id: params.id } });
  if (!vendor) notFound();

  return (
    <div>
      <Link
        href="/admin/vendors?tab=accounts"
        className="font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
      >
        ← Back to Vendors
      </Link>
      <h1 className="mb-8 mt-2 font-display text-4xl text-[#f0e6d3]">
        Edit Vendor
      </h1>

      <div className="max-w-lg rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
        <VendorForm
          vendor={{ id: vendor.id, name: vendor.name, email: vendor.email }}
        />
      </div>
    </div>
  );
}
