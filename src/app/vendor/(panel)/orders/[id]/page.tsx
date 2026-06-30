import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionVendor } from "@/lib/requireVendor";
import { SIZE_LABELS } from "@/lib/sizes";
import { formatAddressLines, type ShippingAddress } from "@/lib/address";
import StatusBadge from "@/components/admin/StatusBadge";
import VendorOrderStatus from "@/components/vendor/VendorOrderStatus";

type VendorOrderDetailProps = { params: { id: string } };

export default async function VendorOrderDetailPage({
  params,
}: VendorOrderDetailProps) {
  const vendor = await getSessionVendor();
  if (!vendor) redirect("/vendor");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  // 404 if the order doesn't exist or belongs to a different vendor.
  if (!order || order.vendorId !== vendor.id) notFound();

  const addressLines = formatAddressLines(
    order.shippingAddress as unknown as ShippingAddress,
  );

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl text-[#f0e6d3]">
              {order.orderNumber}
            </h1>
            <p className="mt-1 font-body text-sm text-[rgba(240,230,211,0.5)]">
              {order.createdAt.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Ship To — fulfillment info only, no email or pricing */}
        <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
          Ship To
        </p>
        <div className="mt-2 font-body text-sm text-[#f0e6d3]">
          {addressLines.map((line, i) => (
            <p key={i} className={i === 0 ? "" : "text-[rgba(240,230,211,0.7)]"}>
              {line}
            </p>
          ))}
        </div>

        {/* Items — no prices */}
        <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
          Items
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[360px]">
            <thead>
              <tr className="text-left">
                {["Product", "Size", "Quantity"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-[rgba(255,255,255,0.08)] py-2 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.4)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[rgba(255,255,255,0.05)] font-body text-sm text-[#f0e6d3]"
                >
                  <td className="py-2 pr-4">{item.product.name}</td>
                  <td className="py-2 pr-4">{SIZE_LABELS[item.size]}</td>
                  <td className="py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status update */}
        <div className="mt-6">
          <VendorOrderStatus orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <Link
        href="/vendor/dashboard"
        className="mt-4 inline-block font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
      >
        ← Back to Orders
      </Link>
    </div>
  );
}
