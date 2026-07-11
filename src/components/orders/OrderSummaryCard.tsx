import type { Prisma } from "@prisma/client";
import { formatUSD } from "@/lib/money";

export type OrderForSummary = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export default function OrderSummaryCard({
  order,
}: {
  order: OrderForSummary;
}) {
  return (
    <div className="rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6">
      <div className="flex items-center justify-between">
        <span className="font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
          Order
        </span>
        <span className="font-condensed text-sm text-[#c9a84c]">
          {order.orderNumber}
        </span>
      </div>

      <hr className="my-4 border-[rgba(255,255,255,0.06)]" />

      <p className="mb-3 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
        Items Ordered
      </p>
      <div>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] py-2"
          >
            <span className="text-sm text-[#f0e6d3]">
              {item.product.name}
              <span className="ml-2 rounded bg-[rgba(201,168,76,0.1)] px-2 py-0.5 font-condensed text-xs uppercase text-[#c9a84c]">
                {item.size}
              </span>
            </span>
            <span className="whitespace-nowrap text-sm text-[rgba(240,230,211,0.6)]">
              {item.quantity} × {formatUSD(item.price)}
            </span>
          </div>
        ))}
      </div>

      <hr className="my-4 border-[rgba(255,255,255,0.06)]" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-[rgba(240,230,211,0.55)]">Subtotal</span>
          <span className="text-sm text-[#f0e6d3]">
            {formatUSD(order.subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[rgba(240,230,211,0.55)]">
            Sales Tax (7%)
          </span>
          <span className="text-sm text-[#f0e6d3]">
            {formatUSD(order.taxAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.55)]">
            Total
          </span>
          <span className="font-display text-xl text-[#c9a84c]">
            {formatUSD(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
