"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Product,
  ProductCategory,
  ProductType,
  Size,
  Species,
} from "@prisma/client";
import { SPECIES_LABELS } from "@/lib/species";
import { PRODUCT_TYPE_LABELS } from "@/lib/productType";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/productCategory";
import { SIZE_LABELS } from "@/lib/sizes";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

const SPECIES_OPTIONS = Object.entries(SPECIES_LABELS) as [Species, string][];
const TYPE_OPTIONS = Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][];
const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORY_LABELS) as [
  ProductCategory,
  string,
][];
const SIZE_OPTIONS = Object.entries(SIZE_LABELS) as [Size, string][];

const INPUT_CLASS =
  "w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.3)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [species, setSpecies] = useState<Species | "">(product?.species ?? "");
  const [type, setType] = useState<ProductType | "">(product?.type ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "ORIGINALS",
  );
  const [priceInput, setPriceInput] = useState(
    product ? (product.price / 100).toFixed(2) : "",
  );
  const [sizes, setSizes] = useState<Size[]>(product?.sizes ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [inStock, setInStock] = useState(product?.inStock ?? true);

  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSize = (size: Size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      setImageUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !type) {
      setError("Please fill in all required fields.");
      return;
    }
    if (category !== "ORIGINALS" && !species) {
      setError("Please select a species for this collection.");
      return;
    }
    const dollars = parseFloat(priceInput);
    if (Number.isNaN(dollars) || dollars < 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!imageUrl) {
      setError("Please upload an image.");
      return;
    }

    setSaving(true);
    setError(null);
    const body = {
      name: name.trim(),
      description: description.trim(),
      species: category === "ORIGINALS" ? null : species,
      type,
      category,
      price: Math.round(dollars * 100),
      sizes,
      imageUrl,
      featured,
      active,
      inStock,
    };
    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  const displaySrc = preview ?? (imageUrl || null);

  return (
    <div>
      <Link
        href="/admin/products"
        className="font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
      >
        ← Back to Products
      </Link>
      <h1 className="mb-8 mt-2 font-display text-4xl text-[#f0e6d3]">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: fields */}
        <div className="flex-[2] space-y-5">
          <div>
            <label className={LABEL_CLASS}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Tarpon Silhouette Tee"
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Premium cotton blend tee…"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {category !== "ORIGINALS" && (
              <div>
                <label className={LABEL_CLASS}>Species</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as Species)}
                  className={INPUT_CLASS}
                >
                  <option value="">Select Species</option>
                  {SPECIES_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={LABEL_CLASS}>Product Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProductType)}
                className={INPUT_CLASS}
              >
                <option value="">Select type…</option>
                {TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Collection</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className={INPUT_CLASS}
            >
              {CATEGORY_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className={INPUT_CLASS}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(([value, label]) => {
                const selected = sizes.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSize(value)}
                    className={`rounded-full px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest transition-colors ${
                      selected
                        ? "bg-[#c9a84c] text-[#0f1117]"
                        : "border border-[rgba(255,255,255,0.08)] bg-[#222840] text-[rgba(240,230,211,0.6)] hover:text-[#f0e6d3]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {(
              [
                { label: "Featured", value: featured, set: setFeatured },
                { label: "Active", value: active, set: setActive },
                { label: "In Stock", value: inStock, set: setInStock },
              ] as const
            ).map((toggle) => (
              <button
                key={toggle.label}
                type="button"
                role="switch"
                aria-checked={toggle.value}
                onClick={() => toggle.set(!toggle.value)}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${
                    toggle.value ? "bg-[#c9a84c]" : "bg-[#222840]"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-[#0f1117] transition-transform ${
                      toggle.value ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
                <span className="font-body text-sm text-[#f0e6d3]">
                  {toggle.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: image upload */}
        <div className="flex-1">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e] p-6">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
              Product Image
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => void handleFiles(e.target.files)}
            />

            {displaySrc ? (
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/20">
                  <Image
                    src={displaySrc}
                    alt="Product preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized={preview !== null}
                  />
                </div>
                {uploading && (
                  <p className="mt-2 font-body text-xs text-[rgba(240,230,211,0.5)]">
                    Uploading…
                  </p>
                )}
                {!uploading && imageUrl && (
                  <p className="mt-2 font-body text-xs text-[#4ade80]">
                    ✓ Uploaded
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 font-body text-sm text-[rgba(240,230,211,0.5)] transition-colors hover:text-[#c9a84c]"
                >
                  Change Image
                </button>
                {imageUrl && (
                  <p className="mt-2 truncate font-mono text-xs text-[rgba(240,230,211,0.3)]">
                    {imageUrl}
                  </p>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void handleFiles(e.dataTransfer.files);
                }}
                className="cursor-pointer rounded-lg border border-dashed border-[rgba(255,255,255,0.15)] p-8 text-center"
              >
                <p className="font-body text-sm text-[rgba(240,230,211,0.4)]">
                  Click to upload or drag &amp; drop
                </p>
                <p className="mt-1 font-body text-xs text-[rgba(240,230,211,0.3)]">
                  JPG, PNG, WebP — max 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="w-full rounded bg-[#c9a84c] px-8 py-3 font-condensed font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50 sm:w-auto"
        >
          {saving ? "Saving…" : "Save Product"}
        </button>
        {error && <p className="mt-3 font-body text-sm text-[#f87171]">{error}</p>}

        {isEdit && (
          <div className="mt-8 border-t border-[rgba(255,255,255,0.08)] pt-6">
            <DeleteProductButton
              productId={product!.id}
              redirectTo="/admin/products"
              label="Delete Product"
            />
          </div>
        )}
      </div>
    </div>
  );
}
