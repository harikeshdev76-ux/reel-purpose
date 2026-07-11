import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderSummaryCard from "@/components/orders/OrderSummaryCard";
import OrderStatusSteps from "@/components/orders/OrderStatusSteps";

type OrderDetailPageProps = { params: { id: string } };

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    session.user?.role !== "customer" ||
    !session.user?.email
  ) {
    redirect("/account/login");
  }

  // Scope to this customer's own orders — 404 if it isn't theirs.
  const order = await prisma.order.findFirst({
    where: { id: params.id, customer: { email: session.user.email } },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const address = order.shippingAddress as {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/account/orders"
          className="mb-4 inline-block font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
        >
          ← Back to Orders
        </Link>
        <h1 className="mb-6 font-display text-4xl text-[#f0e6d3]">
          Order {order.orderNumber}
        </h1>

        <OrderSummaryCard order={order} />

        <div className="mt-4 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6">
          <p className="mb-4 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
            Order Status
          </p>
          <OrderStatusSteps status={order.status} />
        </div>

        {address && (address.line1 || address.name) && (
          <div className="mt-4 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-5">
            <p className="mb-2 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
              Ship To
            </p>
            <p className="text-[#f0e6d3]">
              {address.name || order.customerName}
            </p>
            {address.line1 && (
              <p className="text-sm text-[rgba(240,230,211,0.6)]">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
            )}
            <p className="text-sm text-[rgba(240,230,211,0.6)]">
              {[address.city, address.state].filter(Boolean).join(", ")}{" "}
              {address.zip}
            </p>
          </div>
        )}

        <p className="mt-3 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.4)]">
          Placed on{" "}
          {order.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
