import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SuccessView from "./SuccessView";

export const metadata: Metadata = {
  title: "Order Confirmed · Reel Purpose",
};

type SuccessPageProps = {
  searchParams: { session_id?: string };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;
  const order = sessionId
    ? await prisma.order.findUnique({
        where: { stripeSessionId: sessionId },
        include: { items: { include: { product: true } } },
      })
    : null;

  return <SuccessView order={order} />;
}
