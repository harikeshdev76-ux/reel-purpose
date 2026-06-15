"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import type { OrderWithItems } from "@/lib/emails/OrderConfirmation";

export default function SuccessView({
  order,
}: {
  order: OrderWithItems | null;
}) {
  const { clearCart } = useCart();

  // Empty the cart once payment has succeeded.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="bg-brand-base">
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-sectionGreen text-3xl text-brand-textOnDark">
          ✓
        </div>
        <h1 className="mt-6 font-display text-5xl text-brand-textPrimary">
          Order Confirmed!
        </h1>

        {order ? (
          <>
            <p className="mt-4 font-body text-brand-textMuted">
              Thanks{order.customerName ? ` ${order.customerName}` : ""}!{" "}
              {order.customerEmail
                ? `We've sent a confirmation to ${order.customerEmail}. `
                : ""}
              Your order is being prepared.
            </p>
            <p className="mt-4 font-condensed text-sm uppercase tracking-widest text-brand-textMuted">
              Order {order.orderNumber}
            </p>

            <div className="mt-6 border border-brand-border bg-brand-surface p-6 text-left">
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between font-body text-sm text-brand-textPrimary"
                  >
                    <span>
                      {item.product.name} — {item.size} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-brand-border" />
              <div className="flex justify-between font-display text-lg text-brand-textPrimary">
                <span>Total Paid</span>
                <span className="text-brand-rust">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 font-body text-brand-textMuted">
            Thanks for your order! Your payment was received and your order is
            being prepared.
          </p>
        )}

        <Link
          href="/shop"
          className="mt-8 inline-block bg-brand-rust px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-rustHover"
        >
          Shop More Gear →
        </Link>
      </div>
    </section>
  );
}
