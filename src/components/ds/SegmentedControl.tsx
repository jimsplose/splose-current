"use client";

import { Segmented } from "antd";
import type { ReactNode } from "react";

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: SegmentedControlSize;
  /** Segments grow to fill the container. */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Required — the control has no visible label on its own. */
  "aria-label": string;
  className?: string;
}

const antSizeMap: Record<SegmentedControlSize, "small" | "middle" | "large"> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

/**
 * Horizontal group of 2-4 mutually-exclusive options with a sliding
 * highlight. Use for view switchers (Week / Day / Month), filter modes
 * (All / Active / Archived), tone toggles. Distinct from `Tab` which
 * routes between content panels, and from `Filter` which is the icon-only
 * toggle-group variant. A visible `aria-label` is required.
 */
export default function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  disabled,
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <Segmented<T>
      block={fullWidth}
      size={antSizeMap[size]}
      disabled={disabled}
      value={value}
      onChange={(v) => onChange(v as T)}
      aria-label={ariaLabel}
      className={className}
      options={options.map((o) => ({
        value: o.value,
        label: (
          <span
            aria-label={o.label}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {o.icon ? <span style={{ display: "inline-flex" }}>{o.icon}</span> : null}
            {o.label ? <span>{o.label}</span> : null}
          </span>
        ),
      }))}
    />
  );
}
