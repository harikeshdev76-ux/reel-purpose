import { Species } from "@prisma/client";

/** Display labels for each species enum value. */
export const SPECIES_LABELS: Record<Species, string> = {
  TARPON: "Tarpon",
  SNOOK: "Snook",
  REDFISH: "Redfish",
  TUNA_MAHI: "Tuna / Mahi",
  BASS: "Bass",
  COMING_SOON: "Coming Soon",
};

/** Species offered for filtering on the shop page (COMING_SOON excluded). */
export const FILTERABLE_SPECIES: Species[] = [
  Species.TARPON,
  Species.SNOOK,
  Species.REDFISH,
  Species.TUNA_MAHI,
  Species.BASS,
];
