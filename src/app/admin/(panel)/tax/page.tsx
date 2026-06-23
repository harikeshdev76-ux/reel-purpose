import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/money";
import StatCard from "@/components/admin/StatCard";
import TaxDateFilter from "@/components/admin/TaxDateFilter";

type TaxPageProps = {
  searchParams: { from?: string; to?: string };
};

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default async function TaxPage({ searchParams }: TaxPageProps) {
  const now = new Date();
  const fromStr = searchParams.from ?? fmt(new Date(now.getFullYear(), now.getMonth(), 1));
  const toStr = searchParams.to ?? fmt(now);

  const end = new Date(toStr);
  end.setHours(23, 59, 59, 999);

  // Only completed orders (not PENDING) count toward collected tax / remittance.
  const orders = await prisma.order.findMany({
    where: {
      status: { not: OrderStatus.PENDING },
      createdAt: { gte: new Date(fromStr), lte: end },
    },
    orderBy: { createdAt: "desc" },
  });

  const taxCollected = orders.reduce((sum, o) => sum + o.taxAmount, 0);
  const totalSales = orders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">Sales Tax</h1>

      <TaxDateFilter from={fromStr} to={toStr} />

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tax Collected"
          value={formatUSD(taxCollected)}
          valueClassName="text-[#c9a84c]"
        />
        <StatCard label="Total Sales" value={formatUSD(totalSales)} />
        <StatCard label="Orders in Period" value={String(orders.length)} />
      </div>

      {/* Rate banner */}
      <div className="mb-6 rounded border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] p-4 font-body text-sm text-[rgba(240,230,211,0.6)]">
        Florida Sales Tax Rate: 7.0% (6% state + 1% county surtax). Use the Tax
        Collected figure above to remit to the Florida Department of Revenue.
      </div>

      {/* Per-order breakdown */}
      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["Order #", "Date", "Customer", "Subtotal", "Tax (7%)", "Total"].map(
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
                  colSpan={6}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No completed orders in this period.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3]"
                >
                  <td className="px-4 py-3 font-body">{order.orderNumber}</td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {order.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-body">{order.customerName}</td>
                  <td className="px-4 py-3 font-body">{formatUSD(order.subtotal)}</td>
                  <td className="px-4 py-3 font-body text-[#c9a84c]">
                    {formatUSD(order.taxAmount)}
                  </td>
                  <td className="px-4 py-3 font-body">{formatUSD(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
