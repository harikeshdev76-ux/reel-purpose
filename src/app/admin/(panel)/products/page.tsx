import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { SPECIES_LABELS } from "@/lib/species";
import { PRODUCT_TYPE_LABELS } from "@/lib/productType";
import { PRODUCT_CATEGORY_SHORT } from "@/lib/productCategory";
import { SIZE_LABELS } from "@/lib/sizes";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl text-[#f0e6d3]">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-[#c9a84c] px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e]"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="bg-[#222840] text-left">
              {[
                "Image",
                "Name",
                "Species",
                "Category",
                "Type",
                "Price",
                "Sizes",
                "Stock",
                "Featured",
                "Active",
                "Actions",
              ].map((h) => (
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
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
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
                    {product.species ? (
                      SPECIES_LABELS[product.species]
                    ) : (
                      <span className="text-[rgba(240,230,211,0.3)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-condensed text-xs uppercase text-[rgba(240,230,211,0.6)]">
                    {PRODUCT_CATEGORY_SHORT[product.category]}
                  </td>
                  <td className="px-4 py-3 font-body text-[rgba(240,230,211,0.7)]">
                    {PRODUCT_TYPE_LABELS[product.type]}
                  </td>
                  <td className="px-4 py-3 font-body">
                    {formatPrice(product.price)}
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
                    {product.featured && (
                      <span className="font-body text-xs text-[#c9a84c]">
                        ★ Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.active ? (
                      <span className="font-body text-xs text-[#4ade80]">
                        Active
                      </span>
                    ) : (
                      <span className="font-body text-xs text-[rgba(240,230,211,0.4)]">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-body text-sm text-[#c9a84c]"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
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
