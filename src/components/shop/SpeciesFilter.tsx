"use client";

import { SPECIES_LABELS, FILTERABLE_SPECIES } from "@/lib/species";

type SpeciesFilterProps = {
  selected: string | null;
  onSelect: (species: string | null) => void;
};

const BASE_PILL =
  "px-4 py-2 font-condensed text-sm uppercase tracking-widest transition-colors";
const ACTIVE_PILL = "bg-brand-sectionGreen text-brand-textOnDark";
const INACTIVE_PILL =
  "bg-brand-surface border border-brand-border text-brand-textMuted hover:border-brand-sectionGreen";

export default function SpeciesFilter({
  selected,
  onSelect,
}: SpeciesFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${BASE_PILL} ${selected === null ? ACTIVE_PILL : INACTIVE_PILL}`}
      >
        All
      </button>
      {FILTERABLE_SPECIES.map((species) => (
        <button
          key={species}
          type="button"
          onClick={() => onSelect(species)}
          className={`${BASE_PILL} ${selected === species ? ACTIVE_PILL : INACTIVE_PILL}`}
        >
          {SPECIES_LABELS[species]}
        </button>
      ))}
    </div>
  );
}
