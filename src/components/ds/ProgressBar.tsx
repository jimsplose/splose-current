interface ProgressBarProps {
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  width?: number | string;
  className?: string;
}

const toneColor: Record<string, string> = {
  default: "var(--color-primary)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
};

const sizeHeight: Record<string, number> = {
  sm: 4,
  md: 6,
  lg: 8,
};

export default function ProgressBar({
  value,
  tone = "default",
  size = "md",
  width,
  className,
}: ProgressBarProps) {
  const h = sizeHeight[size];
  const pct = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={className}
      style={{
        height: h,
        width: width ?? "100%",
        borderRadius: 9999,
        backgroundColor: "var(--color-fill-secondary)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: h,
          width: `${pct}%`,
          borderRadius: 9999,
          backgroundColor: toneColor[tone],
          transition: "width 0.2s ease",
        }}
      />
    </div>
  );
}
