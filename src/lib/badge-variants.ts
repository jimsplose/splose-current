export type BadgeVariant = "green" | "blue" | "purple" | "yellow" | "red" | "gray" | "orange" | "cyan" | "pink";

/** Map entity type strings to Badge variant colors */
export const BADGE_TYPE_VARIANTS: Record<string, BadgeVariant> = {
  Invoice: "blue",
  Payment: "green",
  "Progress note": "purple",
  Form: "yellow",
  Letter: "gray",
  General: "gray",
};

export function getBadgeVariant(type: string): BadgeVariant {
  return BADGE_TYPE_VARIANTS[type] || "gray";
}
