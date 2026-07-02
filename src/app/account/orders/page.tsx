import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/components/account/OrderCard";

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    session.user?.role !== "customer" ||
    !session.user?.email
  ) {
    redirect("/account/login");
  }

  const orders = await prisma.order.findMany({
    where: { customer: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/account"
          className="mb-4 inline-block font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
        >
          ← Back to Account
        </Link>
        <h1 className="mb-6 font-display text-4xl text-[#f0e6d3]">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6 text-center">
            <p className="font-body text-sm text-[rgba(240,230,211,0.5)]">
              No orders yet.
            </p>
            <Link
              href="/shop"
              className="mt-2 inline-block font-condensed text-sm uppercase tracking-widest text-[#c9a84c] hover:underline"
            >
              Shop Now →
            </Link>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
