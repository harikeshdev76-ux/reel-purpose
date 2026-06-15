"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { calculateTotal } from "@/lib/tax";
import { formatPrice } from "@/lib/money";
import { SPECIES_LABELS } from "@/lib/species";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tax, total } = calculateTotal(subtotal);
  const isEmpty = items.length === 0;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error("checkout failed");
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("no url");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-brand-base">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl text-brand-textPrimary">Your Cart</h1>

        {isEmpty ? (
          <div className="mt-16 text-center">
            <p className="font-body text-brand-textMuted">Your cart is empty.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block font-condensed text-sm font-bold uppercase tracking-widest text-brand-rust transition-colors hover:text-brand-rustHover"
            >
              Shop Collections →
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-10 lg:flex-row">
            {/* Cart items */}
            <div className="lg:flex-[2]">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 border border-brand-border bg-brand-surface p-4"
                  >
                    <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded bg-black/10">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg text-brand-textPrimary">
                            {item.productName}
                          </h3>
                          {item.species && (
                            <span className="mt-1 inline-block bg-brand-sectionGreen px-2 py-0.5 font-condensed text-[10px] uppercase tracking-widest text-brand-textOnDark">
                              {SPECIES_LABELS[item.species]}
                            </span>
                          )}
                        </div>
                        <span className="font-display text-lg text-brand-rust">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="mt-1 font-condensed text-xs uppercase tracking-widest text-brand-textMuted">
                        Size: {item.size}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-brand-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="px-3 py-1 font-condensed text-brand-textPrimary transition-colors hover:bg-brand-base"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center font-condensed text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="px-3 py-1 font-condensed text-brand-textPrimary transition-colors hover:bg-brand-base"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          className="font-condensed text-xs uppercase tracking-widest text-brand-textMuted transition-colors hover:text-brand-rust"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order summary */}
            <div className="lg:flex-1">
              <div className="border border-brand-border bg-brand-surface p-6">
                <h2 className="font-condensed text-sm font-bold uppercase tracking-widest text-brand-textPrimary">
                  Order Summary
                </h2>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between font-body text-sm text-brand-textPrimary">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between font-body text-sm text-brand-textPrimary">
                    <span>Sales Tax (7%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>
                <hr className="my-4 border-brand-border" />
                <div className="flex items-center justify-between">
                  <span className="font-condensed text-sm uppercase tracking-widest text-brand-textPrimary">
                    Total
                  </span>
                  <span className="font-display text-xl text-brand-textPrimary">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isEmpty || loading}
                  className="mt-6 w-full bg-brand-rust px-7 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-rustHover disabled:cursor-not-allowed disabled:bg-[rgba(30,46,26,0.3)]"
                >
                  {loading ? "Redirecting…" : "Proceed to Checkout"}
                </button>
                {error && (
                  <p className="mt-3 font-condensed text-sm text-brand-rust">
                    {error}
                  </p>
                )}
                <Link
                  href="/shop"
                  className="mt-4 block text-center font-condensed text-sm uppercase tracking-widest text-brand-textMuted transition-colors hover:text-brand-textPrimary"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
