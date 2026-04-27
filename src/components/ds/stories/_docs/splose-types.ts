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

/**
 * Splose tier classification for sidebar tag filtering.
 * - `antd` — pure AntD with `ConfigProvider` + `sploseTheme`, no wrapper.
 * - `extended` — AntD-based wrapper or composed pattern (e.g. `ListPage`,
 *   `AsyncSelect`, `EmailPreview`).
 * - `custom` — no AntD base (e.g. `Text`, `Sparkline`, `PatientAvatar`).
 */
export type SploseTier = "antd" | "extended" | "custom";

/**
 * One entry in `parameters.appPages` — a route where the component is used,
 * with both Vercel and acme.splose.com URL pairs for screenshot capture (#18)
 * and MDX docs (#19).
 */
export interface SploseAppPage {
  /** Human-readable label, e.g. "Patient details — Appointments tab". */
  label: string;
  /** Full Vercel URL (https://splose-current.vercel.app/...). */
  vercel: string;
  /** Full production URL (https://acme.splose.com/...). */
  production: string;
  /** Optional: navigation instructions for dynamic routes. */
  notes?: string;
}

// Ensure @storybook/react is loaded before the augmentation below.
import type {} from "@storybook/react";

declare module "@storybook/react" {
  interface Parameters {
    splose?: SploseStoryMeta;
    /**
     * App routes where this component is used. Drives screenshot capture (#18)
     * and the "In the app" table in MDX docs (#19).
     */
    appPages?: SploseAppPage[];
    /**
     * Reference docs URL for the wrapped library (e.g. AntD docs page).
     * `null` for first-party / custom components.
     */
    referenceUrl?: string | null;
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
