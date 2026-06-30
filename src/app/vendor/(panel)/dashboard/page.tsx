import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionVendor } from "@/lib/requireVendor";
import { SIZE_LABELS } from "@/lib/sizes";
import type { ShippingAddress } from "@/lib/address";
import StatusBadge from "@/components/admin/StatusBadge";
import VendorStatusFilter from "@/components/vendor/VendorStatusFilter";

type DashboardProps = { searchParams: { status?: string } };

function parseStatus(value: string | undefined): OrderStatus | undefined {
  if (value && Object.values(OrderStatus).includes(value as OrderStatus)) {
    return value as OrderStatus;
  }
  return undefined;
}

export default async function VendorDashboard({ searchParams }: DashboardProps) {
  const vendor = await getSessionVendor();
  if (!vendor) redirect("/vendor");

  const status = parseStatus(searchParams.status);
  const where: Prisma.OrderWhereInput = { vendorId: vendor.id };
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">Your Orders</h1>

      <VendorStatusFilter status={searchParams.status ?? ""} />

      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["Order #", "Customer", "Ship To", "Items", "Date", "Status", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No orders assigned yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const addr = order.shippingAddress as unknown as ShippingAddress;
                const shipTo = [addr.city, addr.state].filter(Boolean).join(", ");
                const items = order.items
                  .map((i) => `${i.product.name} (${SIZE_LABELS[i.size]})`)
                  .join(", ");
                return (
                  <tr
                    key={order.id}
                    className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3] transition-colors hover:bg-[rgba(201,168,76,0.04)]"
                  >
                    <td className="px-4 py-3 font-body">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-body">{order.customerName}</td>
                    <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                      {shipTo || "—"}
                    </td>
                    <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                      {items}
                    </td>
                    <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                      {order.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendor/orders/${order.id}`}
                        className="font-body text-sm text-[#c9a84c]"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
