import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/money";
import { SIZE_LABELS } from "@/lib/sizes";
import { colorLabel } from "@/lib/productColors";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderActions from "@/components/admin/OrderActions";

type ShippingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type OrderDetailProps = { params: { id: string } };

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, vendor: true },
  });

  if (!order) notFound();

  const address = order.shippingAddress as unknown as ShippingAddress;

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: order info */}
        <div className="lg:col-span-2">
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

            {/* Customer */}
            <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
              Customer
            </p>
            <div className="mt-2 font-body text-sm text-[#f0e6d3]">
              <p>{order.customerName}</p>
              <p className="text-[rgba(240,230,211,0.7)]">{order.customerEmail}</p>
              <p className="mt-2 text-[rgba(240,230,211,0.7)]">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p className="text-[rgba(240,230,211,0.7)]">
                {[address.city, address.state, address.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            {/* Items */}
            <p className="mt-6 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
              Items
            </p>
            <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="text-left">
                  {["Product", "Size", "Color", "Qty", "Price", "Line Total"].map((h) => (
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
                    <td className="py-2 pr-4">
                      {item.color ? colorLabel(item.color) : "—"}
                    </td>
                    <td className="py-2 pr-4">{item.quantity}</td>
                    <td className="py-2 pr-4">{formatUSD(item.price)}</td>
                    <td className="py-2">{formatUSD(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex flex-col items-end gap-1 font-body text-sm">
              <p className="text-[rgba(240,230,211,0.7)]">
                Subtotal: {formatUSD(order.subtotal)}
              </p>
              <p className="text-[rgba(240,230,211,0.7)]">
                Tax (7%): {formatUSD(order.taxAmount)}
              </p>
              <p className="font-display text-xl text-[#c9a84c]">
                Total: {formatUSD(order.total)}
              </p>
            </div>

            {/* Stripe */}
            <p className="mt-6 font-mono text-xs text-[rgba(240,230,211,0.4)]">
              Stripe: {order.stripeSessionId}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div>
          <OrderActions
            orderId={order.id}
            currentStatus={order.status}
            vendorPaid={order.vendorPaid}
            vendorCost={order.vendorCost}
          />
          <Link
            href="/admin/orders"
            className="mt-4 inline-block font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
