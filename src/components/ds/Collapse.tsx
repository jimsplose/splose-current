"use client";

import type { ReactNode } from "react";
import Accordion from "./Accordion";

interface CollapseProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * @deprecated Use `Accordion` instead. `Collapse` is retained as a thin
 *   single-panel alias during the Wave 4 migration window and will be
 *   removed once consumers migrate. See docs/ds-plans/Accordion.md.
 */
export default function Collapse({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapseProps) {
  return (
    <Accordion
      className={className}
      items={[{ id: "1", title, children, defaultOpen }]}
    />
  );
}
