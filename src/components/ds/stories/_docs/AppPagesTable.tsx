import React from "react";
import type { SploseAppPage, SploseUrlSource } from "./splose-types";

interface AppPagesTableProps {
  /** From the story's `parameters.appPages`. */
  pages?: SploseAppPage[];
  /** URL source — usually wired from the Storybook `source` global; defaults to "vercel". */
  source?: SploseUrlSource;
  /** Optional: override placeholder when no pages exist. */
  emptyMessage?: string;
}

/**
 * Renders the "In the app" table for an MDX doc page.
 *
 * Reads `pages` (typically the story's `parameters.appPages`) and renders one
 * row per call site, with a single URL column whose host swaps based on
 * `source`. The Storybook toolbar `source` global drives `source` when this
 * component is used inside `<Meta of={...} />` MDX docs.
 *
 * MDX usage:
 * ```mdx
 * import { AppPagesTable } from "@/components/ds/stories/_docs";
 * import * as Stories from "./MyComponent.stories";
 * import { useGlobals } from "@storybook/preview-api";
 *
 * <Meta of={Stories} />
 *
 * export const Block = () => {
 *   const [{ source }] = useGlobals();
 *   return <AppPagesTable pages={Stories.default.parameters?.appPages} source={source} />;
 * };
 *
 * <Block />
 * ```
 */
export function AppPagesTable({
  pages,
  source = "vercel",
  emptyMessage = "No call sites in src/app/ yet.",
}: AppPagesTableProps) {
  if (!pages || pages.length === 0) {
    return (
      <p style={{ color: "var(--color-text-secondary, #64748b)", fontStyle: "italic" }}>
        {emptyMessage}
      </p>
    );
  }

  const sourceLabel: Record<SploseUrlSource, string> = {
    localhost: "Localhost",
    vercel: "Vercel",
    production: "Production",
  };

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border, #e2e8f0)" }}>
            <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Page</th>
            <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>
              URL ({sourceLabel[source]})
            </th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p, i) => {
            const url =
              source === "localhost"
                ? p.localhost
                : source === "production"
                  ? p.production
                  : p.vercel;
            return (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--color-border-subtle, #f1f5f9)" }}
              >
                <td style={{ padding: "8px 12px", verticalAlign: "top" }}>
                  {p.label}
                  {p.notes ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary, #64748b)",
                        marginTop: 2,
                      }}
                    >
                      {p.notes}
                    </div>
                  ) : null}
                </td>
                <td style={{ padding: "8px 12px", verticalAlign: "top", wordBreak: "break-all" }}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--color-primary, #6d28d9)", textDecoration: "underline" }}
                  >
                    {url}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-secondary, #64748b)" }}>
        Switch the URL host using the “Source” dropdown in the Storybook toolbar.
      </p>
    </div>
  );
}

export default AppPagesTable;
