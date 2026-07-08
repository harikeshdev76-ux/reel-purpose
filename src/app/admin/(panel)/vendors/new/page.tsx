import Link from "next/link";
import VendorForm from "@/components/admin/VendorForm";

export default function NewVendorPage() {
  return (
    <div>
      <Link
        href="/admin/vendors?tab=accounts"
        className="font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
      >
        ← Back to Vendors
      </Link>
      <h1 className="mb-8 mt-2 font-display text-4xl text-[#f0e6d3]">
        Add Vendor
      </h1>

      <div className="max-w-lg rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
        <VendorForm />
      </div>
    </div>
  );
}
