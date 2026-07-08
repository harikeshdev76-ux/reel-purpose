import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VendorToggleButton from "@/components/admin/VendorToggleButton";

export default async function VendorAccounts() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-[#f0e6d3]">Vendor Accounts</h2>
        <Link
          href="/admin/vendors/new"
          className="rounded bg-[#c9a84c] px-4 py-2 font-condensed text-sm font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e]"
        >
          Add Vendor
        </Link>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["Name", "Email", "Status", "Orders", "Created", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No vendors yet. Add your first vendor account.
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3]"
                >
                  <td className="px-4 py-3 font-condensed">{vendor.name}</td>
                  <td className="px-4 py-3 font-body text-sm text-[rgba(240,230,211,0.6)]">
                    {vendor.email}
                  </td>
                  <td className="px-4 py-3">
                    {vendor.active ? (
                      <span className="rounded bg-[rgba(74,222,128,0.15)] px-2 py-0.5 font-condensed text-xs uppercase text-[#4ade80]">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-[rgba(255,255,255,0.05)] px-2 py-0.5 font-condensed text-xs uppercase text-[rgba(240,230,211,0.4)]">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.6)]">
                    {vendor._count.orders}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-[rgba(240,230,211,0.4)]">
                    {vendor.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Link
                        href={`/admin/vendors/${vendor.id}/edit`}
                        className="text-sm text-[#c9a84c]"
                      >
                        Edit
                      </Link>
                      <VendorToggleButton
                        vendorId={vendor.id}
                        active={vendor.active}
                      />
                    </div>
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
