import type { CSSProperties, ReactNode } from "react";

const gapMap: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface GridProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Grid({ cols = 2, gap = "lg", children, className, style }: GridProps) {
  const gapValue = typeof gap === "number" ? gap : gapMap[gap];
  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: gapValue,
    ...style,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
}
