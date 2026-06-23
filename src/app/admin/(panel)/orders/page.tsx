import Link from "next/link";
import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/money";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderFilters from "@/components/admin/OrderFilters";

type OrdersPageProps = {
  searchParams: { status?: string; from?: string; to?: string };
};

function parseStatus(value: string | undefined): OrderStatus | undefined {
  if (value && Object.values(OrderStatus).includes(value as OrderStatus)) {
    return value as OrderStatus;
  }
  return undefined;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const status = parseStatus(searchParams.status);
  const from = searchParams.from ?? "";
  const to = searchParams.to ?? "";

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;

  const createdAt: Prisma.DateTimeFilter = {};
  if (from) createdAt.gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    createdAt.lte = end;
  }
  if (createdAt.gte || createdAt.lte) where.createdAt = createdAt;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      vendor: true,
    },
  });

  const totalAmount = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-[#f0e6d3]">Orders</h1>

      <OrderFilters
        status={searchParams.status ?? ""}
        from={from}
        to={to}
      />

      <p className="mb-4 font-body text-sm text-[rgba(240,230,211,0.5)]">
        {orders.length} order{orders.length === 1 ? "" : "s"} · Total:{" "}
        {formatUSD(totalAmount)}
      </p>

      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {[
                "Order #",
                "Customer",
                "Items",
                "Subtotal",
                "Tax",
                "Total",
                "Date",
                "Status",
                "Vendor",
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                return (
                  <tr
                    key={order.id}
                    className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3] transition-colors hover:bg-[rgba(201,168,76,0.04)]"
                  >
                    <td className="px-4 py-3 font-body">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-body">{order.customerName}</td>
                    <td className="px-4 py-3 font-body">{itemCount}</td>
                    <td className="px-4 py-3 font-body">
                      {formatUSD(order.subtotal)}
                    </td>
                    <td className="px-4 py-3 font-body">
                      {formatUSD(order.taxAmount)}
                    </td>
                    <td className="px-4 py-3 font-body">
                      {formatUSD(order.total)}
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
                    <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                      {order.vendor?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
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
