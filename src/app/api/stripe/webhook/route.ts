import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { OrderStatus } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import OrderConfirmation, {
  type OrderWithItems,
} from "@/lib/emails/OrderConfirmation";
import VendorNotification from "@/lib/emails/VendorNotification";
import type { ShippingAddress } from "@/lib/address";

// App Router reads the raw body via req.text(); the Pages-style
// `bodyParser: false` config is not needed (and is ignored) here.

type StripeAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

function extractShipping(session: Stripe.Checkout.Session): ShippingAddress {
  // `shipping_details` is not consistently present on the typed Session across
  // Stripe SDK versions, so read it through a narrow cast and fall back to the
  // customer details address.
  const shipping = (
    session as unknown as {
      shipping_details?: { name?: string | null; address?: StripeAddress } | null;
    }
  ).shipping_details;
  const address = shipping?.address ?? session.customer_details?.address ?? null;
  const name = shipping?.name ?? session.customer_details?.name ?? "";

  return {
    name,
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    zip: address?.postal_code ?? "",
    country: address?.country ?? "",
  };
}

async function sendEmails(order: OrderWithItems) {
  const from = process.env.RESEND_FROM_EMAIL || "orders@reelpurpose.fishing";

  try {
    if (order.customerEmail) {
      await resend.emails.send({
        from,
        to: order.customerEmail,
        subject: "Your Reel Purpose order is confirmed! 🎣",
        react: OrderConfirmation({ order }),
      });
    }
  } catch (e) {
    console.error("Customer confirmation email failed:", e);
  }

  try {
    const vendorEmail = process.env.VENDOR_EMAIL;
    if (vendorEmail) {
      await resend.emails.send({
        from,
        to: vendorEmail,
        subject: `New Reel Purpose Order — ${order.orderNumber}`,
        react: VendorNotification({ order }),
      });
    }
  } catch (e) {
    console.error("Vendor notification email failed:", e);
  }
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        // Auto-assign the order to the single active vendor so it appears in
        // their fulfillment dashboard immediately.
        const vendor = await prisma.vendor.findFirst({
          where: { active: true },
          orderBy: { createdAt: "asc" },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.FULFILLED,
            customerName: session.customer_details?.name ?? "",
            customerEmail: session.customer_details?.email ?? "",
            shippingAddress: extractShipping(session),
            stripeSessionId: session.id,
            vendorId: vendor?.id ?? null,
            // Reinforce the customer link from checkout metadata (guests omit
            // it, leaving the field unchanged).
            customerId: session.metadata?.customerId ?? undefined,
          },
        });

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: { include: { product: true } } },
        });

        if (order) {
          // Email failures must not cause Stripe to retry the webhook.
          await sendEmails(order);
        }
      } catch (e) {
        console.error("Webhook processing error:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
