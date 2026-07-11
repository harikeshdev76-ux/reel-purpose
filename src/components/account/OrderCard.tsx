import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { formatUSD } from "@/lib/money";
import StatusBadge from "@/components/admin/StatusBadge";

export type OrderCardData = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export default function OrderCard({ order }: { order: OrderCardData }) {
  return (
    <div className="mb-3 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-4">
      <div className="flex items-center justify-between">
        <span className="font-condensed text-sm uppercase tracking-widest text-[#f0e6d3]">
          {order.orderNumber}
        </span>
        <span className="font-body text-xs text-[rgba(240,230,211,0.5)]">
          {order.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <ul className="mt-3 space-y-1">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="font-body text-sm text-[rgba(240,230,211,0.7)]"
          >
            {item.product.name} · {item.size}
            {item.quantity > 1 ? ` × ${item.quantity}` : ""}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={order.status} />
        <span className="font-display text-lg text-[#c9a84c]">
          {formatUSD(order.total)}
        </span>
      </div>

      <Link
        href={`/account/orders/${order.id}`}
        className="mt-3 inline-block font-condensed text-xs uppercase tracking-widest text-[#c9a84c] transition-colors hover:text-[#b8952e]"
      >
        View Details →
      </Link>
    </div>
  );
}
