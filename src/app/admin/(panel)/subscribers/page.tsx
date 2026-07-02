import { prisma } from "@/lib/prisma";

export default async function SubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl text-[#f0e6d3]">
          Newsletter Subscribers
        </h1>
        <span className="rounded bg-[rgba(201,168,76,0.15)] px-3 py-1 font-condensed text-xs uppercase tracking-widest text-[#c9a84c]">
          {subscribers.length}{" "}
          {subscribers.length === 1 ? "subscriber" : "subscribers"}
        </span>
      </div>

      {/* Subscribers table */}
      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["#", "Email", "Subscribed Date"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub, index) => (
                <tr
                  key={sub.id}
                  className="border-b border-[rgba(255,255,255,0.05)] text-sm transition-colors hover:bg-[rgba(201,168,76,0.04)]"
                >
                  <td className="px-4 py-3 font-body text-xs text-[rgba(240,230,211,0.3)]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-body text-[#f0e6d3]">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.5)]">
                    {sub.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {sub.createdAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
