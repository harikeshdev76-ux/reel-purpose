import VendorTabs from "@/components/admin/VendorTabs";
import VendorPaymentTracking from "@/components/admin/VendorPaymentTracking";
import VendorAccounts from "@/components/admin/VendorAccounts";

type VendorsPageProps = {
  searchParams: { tab?: string };
};

export default function VendorsPage({ searchParams }: VendorsPageProps) {
  const tab = searchParams.tab === "accounts" ? "accounts" : "payments";

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl text-[#f0e6d3]">Vendors</h1>

      <VendorTabs active={tab} />

      {tab === "accounts" ? <VendorAccounts /> : <VendorPaymentTracking />}
    </div>
  );
}
