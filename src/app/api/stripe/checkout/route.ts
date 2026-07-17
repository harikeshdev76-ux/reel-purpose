import { NextResponse } from "next/server";
import type { Size } from "@prisma/client";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { calculateTotal } from "@/lib/tax";
import { colorLabel } from "@/lib/productColors";

type IncomingItem = {
  productId: string;
  size: Size;
  quantity: number;
  color?: string;
};

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

    // Link the order to a logged-in customer (guests remain null). Named
    // authSession to avoid colliding with the Stripe `session` below.
    const authSession = await getServerSession(authOptions);
    let customerId: string | null = null;
    let customerEmail: string | undefined;
    if (authSession?.user?.role === "customer" && authSession.user.email) {
      const customer = await prisma.customer.findUnique({
        where: { email: authSession.user.email },
        select: { id: true, email: true },
      });
      if (customer) {
        customerId = customer.id;
        customerEmail = customer.email;
      }
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
        return {
          product,
          size: i.size,
          quantity,
          price: product.price,
          color: i.color ?? null,
        };
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
        customerId,
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
            color: li.color,
            quantity: li.quantity,
            price: li.price,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        ...lineItems.map((li) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: li.color
                ? `${li.product.name} — ${colorLabel(li.color)} / ${li.size}`
                : `${li.product.name} — ${li.size}`,
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
      metadata: {
        orderId: order.id,
        ...(customerId ? { customerId } : {}),
      },
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
