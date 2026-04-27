/**
 * Shared metadata contract for Splose DS Storybook entries.
 *
 * Every Wave 4 component (and future DS component) declares a
 * `parameters.splose` block on its Meta using `SploseStoryMeta`. The
 * `SploseDocHeader` component reads these values to render a consistent
 * header (status pill, summary, links) on every MDX doc page.
 *
 * When a planned component is built, flip `status: "planned"` → `"beta"` in
 * the same commit that ships the real component. Once verified in
 * production for a release, flip to `"stable"`.
 */

export type SploseStatus =
  | "planned"
  | "alpha"
  | "beta"
  | "stable"
  | "deprecated";

export type SploseReferenceLibrary =
  | "antd"
  | "radix"
  | "sonner"
  | "cmdk"
  | "downshift"
  | "signature-pad"
  | "first-party";

export interface SploseStoryMeta {
  /** Component lifecycle state shown in Storybook header + ds-component-catalog. */
  status: SploseStatus;
  /** One-sentence summary shown in the Storybook sidebar and catalog. */
  summary: string;
  /** Inline pattern the component replaces at call sites today (empty for net-new). */
  whatToUseInstead?: string;
  /** Library the component wraps (AntD, first-party, hand-rolled). */
  referenceLibrary?: SploseReferenceLibrary;
  /** Ticket link if one exists. */
  jira?: string;
  /** Relative path (from repo root) to the build plan doc. */
  plan?: string;
  /** Relative path (from repo root) to the component source file. */
  source?: string;
}

// Ensure @storybook/react is loaded before the augmentation below.
import type {} from "@storybook/react";

declare module "@storybook/react" {
  interface Parameters {
    splose?: SploseStoryMeta;
  }
}

/**
 * Badge variant mapping for each lifecycle status.
 * Matches the Splose `Badge` component's variant names.
 */
export const statusBadgeVariant: Record<
  SploseStatus,
  "gray" | "yellow" | "blue" | "green" | "red"
> = {
  planned: "gray",
  alpha: "yellow",
  beta: "blue",
  stable: "green",
  deprecated: "red",
};

/** Human-readable label for each status. */
export const statusLabel: Record<SploseStatus, string> = {
  planned: "Planned",
  alpha: "Alpha",
  beta: "Beta",
  stable: "Stable",
  deprecated: "Deprecated",
};
