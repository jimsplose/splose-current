import Badge from "../../Badge";
import {
  statusBadgeVariant,
  statusLabel,
  type SploseStoryMeta,
} from "./splose-types";

interface SploseDocHeaderProps {
  /** Component name — shown as the H1. */
  name: string;
  /** The `parameters.splose` object from the component's story Meta. */
  meta: SploseStoryMeta;
}

/**
 * Header block for Splose DS MDX doc pages.
 *
 * Renders:
 *   - Component name (H1)
 *   - Lifecycle status pill (Badge with variant mapped from status)
 *   - One-line summary
 *   - Link row: Jira ticket, build plan, source file
 *
 * Usage inside an MDX file:
 *
 *     import { Meta } from "@storybook/addon-docs/blocks";
 *     import * as TooltipStories from "../planned/Tooltip.stories";
 *     import { SploseDocHeader } from "../_docs/SploseDocHeader";
 *
 *     <Meta of={TooltipStories} />
 *     <SploseDocHeader name="Tooltip" meta={TooltipStories.default.parameters.splose} />
 */
export function SploseDocHeader({ name, meta }: SploseDocHeaderProps) {
  const links: Array<{ label: string; href: string }> = [];
  if (meta.jira) links.push({ label: "Jira", href: meta.jira });
  if (meta.plan) {
    links.push({
      label: "Build plan",
      href: `https://github.com/jimsplose/splose-current/blob/main/${meta.plan}`,
    });
  }
  if (meta.source) {
    links.push({
      label: "Source",
      href: `https://github.com/jimsplose/splose-current/blob/main/${meta.source}`,
    });
  }

  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 0",
        borderBottom: "1px solid var(--color-border, #e5e5e5)",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {name}
        </h1>
        <Badge variant={statusBadgeVariant[meta.status]} size="md">
          {statusLabel[meta.status]}
        </Badge>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.5,
          color: "#6E6E64",
          maxWidth: 720,
        }}
      >
        {meta.summary}
      </p>

      {meta.whatToUseInstead ? (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.5,
            color: "#6E6E64",
            maxWidth: 720,
          }}
        >
          <strong style={{ color: "#414549" }}>Replaces:</strong>{" "}
          {meta.whatToUseInstead}
        </p>
      ) : null}

      {links.length > 0 ? (
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5578FF", textDecoration: "none" }}
            >
              {link.label} →
            </a>
          ))}
          {meta.referenceLibrary ? (
            <span style={{ color: "#a5a59e" }}>
              Wraps <code>{meta.referenceLibrary}</code>
            </span>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

export default SploseDocHeader;
