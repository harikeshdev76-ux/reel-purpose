import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/components/account/OrderCard";
import AccountActions from "@/components/account/AccountActions";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    session.user?.role !== "customer" ||
    !session.user?.email
  ) {
    redirect("/account/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: { include: { product: true } } },
      },
    },
  });
  if (!customer) redirect("/account/login");

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-8">
          <h1 className="font-display text-4xl text-[#f0e6d3]">
            Welcome, {customer.name}
          </h1>
          <p className="mt-1 font-body text-sm text-[rgba(240,230,211,0.5)]">
            {customer.email}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Orders */}
          <section className="lg:col-span-2">
            <h2 className="mb-4 font-display text-2xl text-[#f0e6d3]">
              Recent Orders
            </h2>
            {customer.orders.length === 0 ? (
              <div className="rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#141b22] p-6 text-center">
                <p className="font-body text-sm text-[rgba(240,230,211,0.5)]">
                  No orders yet.
                </p>
                <Link
                  href="/shop"
                  className="mt-2 inline-block font-condensed text-sm uppercase tracking-widest text-[#c9a84c] hover:underline"
                >
                  Start shopping →
                </Link>
              </div>
            ) : (
              <>
                {customer.orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                <Link
                  href="/account/orders"
                  className="mt-2 inline-block font-condensed text-sm uppercase tracking-widest text-[#c9a84c] hover:underline"
                >
                  View all orders →
                </Link>
              </>
            )}
          </section>

          {/* Account Actions */}
          <aside className="lg:col-span-1">
            <AccountActions />
          </aside>
        </div>
      </div>
    </div>
  );
}
