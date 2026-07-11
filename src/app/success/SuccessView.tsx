"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import OrderSummaryCard, {
  type OrderForSummary,
} from "@/components/orders/OrderSummaryCard";
import OrderStatusSteps from "@/components/orders/OrderStatusSteps";

export default function SuccessView({
  order,
}: {
  order: OrderForSummary | null;
}) {
  const { clearCart } = useCart();
  const { data: session } = useSession();
  const isCustomer = session?.user?.role === "customer";

  // Empty the cart once payment has succeeded.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(74,222,128,0.1)] p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#4ade80"
              className="h-10 w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-5xl text-[#f0e6d3]">
            Order Confirmed!
          </h1>
          <p className="mt-3 font-body text-lg text-[rgba(240,230,211,0.6)]">
            Thank you for your purchase. Your order has been received and is
            being prepared.
          </p>
        </div>

        {order && (
          <>
            <div className="mt-8">
              <OrderSummaryCard order={order} />
            </div>

            <div className="mt-4 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6">
              <p className="mb-4 font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
                Order Status
              </p>
              <OrderStatusSteps status={order.status} />
            </div>

            <div className="mt-4 rounded border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.06)] p-4">
              <p className="font-body text-sm text-[rgba(240,230,211,0.6)]">
                We&apos;ll update your order status as it progresses. Check back
                here anytime to see where your order is.
              </p>
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-[#c9a84c] px-8 py-3 text-center font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e]"
          >
            Continue Shopping
          </Link>
          {isCustomer && (
            <Link
              href="/account/orders"
              className="rounded-full border border-[rgba(201,168,76,0.3)] px-8 py-3 text-center font-condensed font-bold uppercase tracking-widest text-[#c9a84c] transition-colors hover:border-[#c9a84c]"
            >
              View Order History
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
