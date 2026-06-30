import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SPECIES_LABELS } from "@/lib/species";
import { PRODUCT_TYPE_LABELS } from "@/lib/productType";
import { SIZE_LABELS } from "@/lib/sizes";
import VendorStockToggle from "@/components/vendor/VendorStockToggle";

export default async function VendorProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-[#f0e6d3]">Manage Stock</h1>
      <p className="mb-6 mt-1 font-body text-sm text-[rgba(240,230,211,0.5)]">
        Mark products as out of stock if you don&apos;t have items available.
      </p>

      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {["Image", "Name", "Species", "Type", "Sizes", "Stock Status", "Action"].map(
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
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center font-body text-sm text-[rgba(240,230,211,0.5)]"
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[rgba(255,255,255,0.05)] text-sm text-[#f0e6d3]"
                >
                  <td className="px-4 py-3">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-[#222840]" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-body">{product.name}</td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {SPECIES_LABELS[product.species]}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {PRODUCT_TYPE_LABELS[product.type]}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {product.sizes.map((s) => SIZE_LABELS[s]).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {product.inStock ? (
                      <span className="rounded bg-[rgba(74,222,128,0.15)] px-2 py-0.5 font-condensed text-xs uppercase text-[#4ade80]">
                        In Stock
                      </span>
                    ) : (
                      <span className="rounded bg-[rgba(248,113,113,0.15)] px-2 py-0.5 font-condensed text-xs uppercase text-[#f87171]">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <VendorStockToggle
                      productId={product.id}
                      inStock={product.inStock}
                    />
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
