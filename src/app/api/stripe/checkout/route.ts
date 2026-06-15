import { NextResponse } from "next/server";
import type { Size } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculateTotal } from "@/lib/tax";

type IncomingItem = { productId: string; size: Size; quantity: number };

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function absoluteImage(url: string): string {
  return url.startsWith("http") ? url : `${appUrl()}${url}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: IncomingItem[] };
    const items = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Load authoritative prices from the DB — never trust client-sent prices.
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, active: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const lineItems = items
      .map((i) => {
        const product = byId.get(i.productId);
        if (!product) return null;
        const quantity = Math.max(1, Math.floor(i.quantity || 1));
        return { product, size: i.size, quantity, price: product.price };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }

    const subtotal = lineItems.reduce(
      (sum, li) => sum + li.price * li.quantity,
      0,
    );
    const { tax, total } = calculateTotal(subtotal);
    const orderNumber = "RP-" + Date.now().toString().slice(-6);

    // Create the pending order first. stripeSessionId is unique + required, so
    // use a unique placeholder until the real session id is known.
    const order = await prisma.order.create({
      data: {
        orderNumber,
        stripeSessionId: `pending_${orderNumber}`,
        customerName: "",
        customerEmail: "",
        shippingAddress: {},
        subtotal,
        taxAmount: tax,
        total,
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            size: li.size,
            quantity: li.quantity,
            price: li.price,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...lineItems.map((li) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${li.product.name} — ${li.size}`,
              images: [absoluteImage(li.product.imageUrl)],
            },
            unit_amount: li.price,
          },
          quantity: li.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Florida Sales Tax (7%)" },
            unit_amount: tax,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl()}/cart`,
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 },
    );
  }
}
