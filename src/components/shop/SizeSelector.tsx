"use client";

import type { Size } from "@prisma/client";

const SIZE_LABELS: Record<Size, string> = {
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  ONE_SIZE: "One Size",
};

type SizeSelectorProps = {
  sizes: Size[];
  selected: Size | null;
  onSelect: (size: Size) => void;
};

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`min-w-[3rem] px-4 py-2 font-condensed text-sm uppercase tracking-widest transition-colors ${
            selected === size
              ? "bg-brand-sectionGreen text-brand-textOnDark"
              : "border border-brand-border text-brand-textPrimary hover:border-brand-sectionGreen"
          }`}
        >
          {SIZE_LABELS[size]}
        </button>
      ))}
    </div>
  );
}
