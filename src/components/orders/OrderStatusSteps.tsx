import { Fragment } from "react";
import type { OrderStatus } from "@prisma/client";

export default function OrderStatusSteps({ status }: { status: OrderStatus }) {
  const step2Done = status === "FULFILLED" || status === "SHIPPED";
  const step3Done = status === "SHIPPED";

  const steps = [
    { label: "Order Placed", done: true, active: false },
    { label: "Being Prepared", done: step2Done, active: status === "PENDING" },
    { label: "Shipped", done: step3Done, active: false },
  ];

  return (
    <div className="flex items-start">
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          {i > 0 && (
            <div
              className={`mt-5 h-0.5 flex-1 ${
                steps[i - 1].done
                  ? "bg-[rgba(201,168,76,0.3)]"
                  : "bg-[rgba(255,255,255,0.08)]"
              }`}
            />
          )}
          <div className="flex w-20 flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.done
                  ? "border-[#c9a84c] bg-[#c9a84c]"
                  : step.active
                    ? "border-[#c9a84c]"
                    : "border-[rgba(255,255,255,0.15)]"
              }`}
            >
              {step.done ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="#0d1117"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ) : step.active ? (
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#c9a84c]" />
              ) : null}
            </div>
            <span
              className={`text-center font-condensed text-xs uppercase tracking-widest ${
                step.done || step.active
                  ? "text-[rgba(240,230,211,0.7)]"
                  : "text-[rgba(240,230,211,0.35)]"
              }`}
            >
              {step.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
