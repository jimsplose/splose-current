"use client";
/**
 * @deprecated Use AntD `Tag` directly. For user-configured hex colours, import
 * `pickTextColor` from `src/lib/color.ts` and pass `style={{color: pickTextColor(color), backgroundColor: color}}`.
 * For interactive/selected → AntD `Tag.CheckableTag`. For removable → AntD Tag `closable` + `onClose`.
 * Remove after zero-usage tests pass.
 */
import type { ReactNode } from "react";

export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
  children: ReactNode;
  /** Hex or CSS colour from the `/settings/tags` config. Omit for the neutral default. */
  color?: string;
  icon?: ReactNode;
  /** When provided, renders a × affordance that calls this on click. */
  onRemove?: () => void;
  size?: TagSize;
  /** When true, renders as a `<button>` with hover/focus affordance. */
  interactive?: boolean;
  /** For filter-style multi-select UIs — adds a ring + subtle shadow. */
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap: Record<TagSize, { height: number; padding: string; fontSize: number; remove: number }> = {
  sm: { height: 22, padding: "0 7px", fontSize: 12, remove: 10 },
  md: { height: 24, padding: "2px 10px", fontSize: 13, remove: 12 },
  lg: { height: 28, padding: "4px 12px", fontSize: 14, remove: 14 },
};

/**
 * Parse a hex or CSS colour string and decide whether to render white or
 * dark text on top of it for WCAG-AA legibility. Falls back to dark text
 * for any unparseable input.
 */
function pickTextColor(color: string | undefined): string {
  if (!color) return "var(--color-text, #2C2C2C)";
  const hex = color.trim().replace(/^#/, "");
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    return "var(--color-text, #2C2C2C)";
  }
  // Perceived luminance (0-1). <0.55 is considered dark.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55 ? "#ffffff" : "var(--color-text, #2C2C2C)";
}

/**
 * User-generated, colour-coded label for records — the metadata that
 * admins configure in `/settings/tags`. Distinct from `Badge` (system
 * status). Supply `color` from the tag config; contrast-aware text
 * colour is chosen automatically. Use `interactive` + `selected` for
 * filter-bar UIs; `onRemove` for removable chips on forms.
 */
export default function Tag({
  children,
  color,
  icon,
  onRemove,
  size = "sm",
  interactive = false,
  selected = false,
  onClick,
  className,
}: TagProps) {
  const spec = sizeMap[size];
  const background = color ?? "#ffffff";
  const borderColor = color ? "transparent" : "rgb(217, 217, 217)";
  const textColor = pickTextColor(color);

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    height: spec.height,
    padding: spec.padding,
    fontSize: spec.fontSize,
    fontWeight: 400,
    lineHeight: 1,
    borderRadius: 8,
    backgroundColor: background,
    color: textColor,
    border: `1px solid ${borderColor}`,
    boxShadow: selected
      ? "0 0 0 2px var(--color-primary, #5578FF)"
      : undefined,
    cursor: interactive || onClick ? "pointer" : undefined,
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  const body = (
    <>
      {icon ? <span style={{ display: "inline-flex" }}>{icon}</span> : null}
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${typeof children === "string" ? children : "tag"}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            border: "none",
            background: "transparent",
            color: textColor,
            cursor: "pointer",
            padding: 0,
            marginLeft: 2,
            width: spec.remove,
            height: spec.remove,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            lineHeight: 1,
            fontSize: spec.remove,
          }}
        >
          ×
        </button>
      ) : null}
    </>
  );

  if (interactive || onClick) {
    return (
      <button
        type="button"
        aria-pressed={interactive ? selected : undefined}
        onClick={onClick}
        className={className}
        style={baseStyle}
      >
        {body}
      </button>
    );
  }

  return (
    <span className={className} style={baseStyle}>
      {body}
    </span>
  );
}
