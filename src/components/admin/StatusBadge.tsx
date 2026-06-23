import type { OrderStatus } from "@prisma/client";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-[rgba(251,146,60,0.15)] text-[#fb923c]",
  FULFILLED: "bg-[rgba(74,222,128,0.15)] text-[#4ade80]",
  SHIPPED: "bg-[rgba(201,168,76,0.15)] text-[#c9a84c]",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-condensed text-xs uppercase ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
