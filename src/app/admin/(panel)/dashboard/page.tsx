import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/money";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function DashboardPage() {
  const todayStart = startOfToday();
  const monthStart = startOfMonth();

  // Abandoned PENDING orders (created at checkout-start before payment, never
  // completed by the Stripe webhook) are not real sales — exclude them from
  // revenue, order counts, tax collected, amount owed, and the activity feed.
  const [todayAgg, owedAgg, taxAgg, recentOrders, outOfStockCount] =
    await Promise.all([
      prisma.order.aggregate({
        _count: true,
        _sum: { total: true },
        where: { createdAt: { gte: todayStart }, status: { not: "PENDING" } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { vendorPaid: false, status: { not: "PENDING" } },
      }),
      prisma.order.aggregate({
        _sum: { taxAmount: true },
        where: { createdAt: { gte: monthStart }, status: { not: "PENDING" } },
      }),
      prisma.order.findMany({
        where: { status: { not: "PENDING" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: { include: { product: true } } },
      }),
      prisma.product.count({ where: { inStock: false } }),
    ]);

  const todayOrders = todayAgg._count;
  const todayRevenue = todayAgg._sum.total ?? 0;
  const owedToVendor = owedAgg._sum.total ?? 0;
  const taxThisMonth = taxAgg._sum.taxAmount ?? 0;

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">Dashboard</h1>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Today's Orders"
          value={String(todayOrders)}
          valueClassName={todayOrders > 0 ? "text-[#c9a84c]" : "text-[#f0e6d3]"}
        />
        <StatCard label="Today's Revenue" value={formatUSD(todayRevenue)} />
        <StatCard
          label="Owed to Vendor"
          value={formatUSD(owedToVendor)}
          valueClassName={owedToVendor > 0 ? "text-[#fb923c]" : "text-[#f0e6d3]"}
        />
        <StatCard label="Tax This Month" value={formatUSD(taxThisMonth)} />
      </div>

      {/* Out of stock alert */}
      {outOfStockCount > 0 && (
        <Link
          href="/admin/products"
          className="mb-6 block rounded-lg border border-[#fb923c]/30 bg-[rgba(251,146,60,0.1)] p-4 text-sm text-[#fb923c]"
        >
          {outOfStockCount} product{outOfStockCount === 1 ? "" : "s"} currently out
          of stock
        </Link>
      )}

      {/* Recent orders */}
      <h2 className="mb-4 font-display text-2xl text-[#f0e6d3]">Recent Orders</h2>
      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["Order #", "Customer", "Items", "Total", "Date", "Status"].map(
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
            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                return (
                  <tr
                    key={order.id}
                    className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3] transition-colors hover:bg-[rgba(201,168,76,0.05)]"
                  >
                    <td className="px-4 py-3 font-body">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-body">{order.customerName}</td>
                    <td className="px-4 py-3 font-body">{itemCount}</td>
                    <td className="px-4 py-3 font-body">{formatUSD(order.total)}</td>
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Link
        href="/admin/orders"
        className="mt-4 inline-block font-body text-sm text-[#c9a84c]"
      >
        View All Orders →
      </Link>
    </div>
  );
}
