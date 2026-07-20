import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/money";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import MarkPaidButton from "@/components/admin/MarkPaidButton";
import Collapsible from "@/components/admin/Collapsible";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

/** Amount owed/paid to the vendor for an order: explicit vendorCost, else order total. */
function vendorAmount(order: OrderWithItems): number {
  return order.vendorCost ?? order.total;
}

function itemCount(order: OrderWithItems): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Order customer name, or a muted "Guest Customer" fallback when missing. */
function CustomerCell({ name }: { name: string }) {
  if (!name || name.trim() === "") {
    return (
      <span className="text-sm italic text-[rgba(240,230,211,0.4)]">
        Guest Customer
      </span>
    );
  }
  return <>{name}</>;
}

export default async function VendorPaymentTracking() {
  const [unpaidOrders, paidOrders] = await Promise.all([
    // Only real sales are owed to the vendor. An Order row is created at
    // checkout-start (status PENDING, blank customer) before payment; if the
    // customer abandons Stripe, the completion webhook never fires and the row
    // stays PENDING forever. Excluding PENDING keeps those abandoned orders out
    // of the payment queue and out of the Outstanding Balance total.
    prisma.order.findMany({
      where: { vendorPaid: false, status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    }),
    prisma.order.findMany({
      where: { vendorPaid: true },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    }),
  ]);

  const totalOwed = unpaidOrders.reduce((sum, o) => sum + vendorAmount(o), 0);
  const totalPaid = paidOrders.reduce((sum, o) => sum + vendorAmount(o), 0);

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Outstanding Balance"
          value={formatUSD(totalOwed)}
          valueClassName={totalOwed > 0 ? "text-[#fb923c]" : "text-[#f0e6d3]"}
        />
        <StatCard
          label="Total Paid to Date"
          value={formatUSD(totalPaid)}
          valueClassName="text-[#4ade80]"
        />
        <StatCard label="Unpaid Orders" value={String(unpaidOrders.length)} />
      </div>

      {/* Unpaid orders */}
      <h2 className="mb-4 font-display text-2xl text-[#f0e6d3]">
        Orders Awaiting Payment
      </h2>
      <div className="mb-10 overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {[
                "Order #",
                "Date",
                "Customer",
                "Items",
                "Customer Total",
                "Vendor Cost",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unpaidOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No orders awaiting payment.
                </td>
              </tr>
            ) : (
              unpaidOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3] transition-colors hover:bg-[rgba(201,168,76,0.04)]"
                >
                  <td className="px-4 py-3 font-body">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[#c9a84c]"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {order.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-body">
                    <CustomerCell name={order.customerName} />
                  </td>
                  <td className="px-4 py-3 font-body">{itemCount(order)}</td>
                  <td className="px-4 py-3 font-body">{formatUSD(order.total)}</td>
                  <td className="px-4 py-3 font-body">
                    {order.vendorCost != null ? (
                      formatUSD(order.vendorCost)
                    ) : (
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[rgba(240,230,211,0.4)] underline-offset-2 hover:underline"
                      >
                        Not set
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <MarkPaidButton orderId={order.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paid history (collapsed) */}
      <Collapsible title="Paid Orders (Historical)">
        <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="bg-[#222840] text-left">
                {[
                  "Order #",
                  "Date",
                  "Customer",
                  "Items",
                  "Vendor Cost",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.4)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paidOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center font-body text-sm text-[rgba(240,230,211,0.4)]"
                  >
                    No paid orders yet.
                  </td>
                </tr>
              ) : (
                paidOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[rgba(240,230,211,0.55)]"
                  >
                    <td className="px-4 py-3 font-body">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-body">
                      {order.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-body">
                    <CustomerCell name={order.customerName} />
                  </td>
                    <td className="px-4 py-3 font-body">{itemCount(order)}</td>
                    <td className="px-4 py-3 font-body">
                      {formatUSD(vendorAmount(order))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Collapsible>
    </div>
  );
}
