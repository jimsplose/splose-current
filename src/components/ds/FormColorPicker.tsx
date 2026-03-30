"use client";

import { ColorPicker, Flex, theme } from "antd";

const DEFAULT_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78716c", "#6b7280", "#1e293b",
];

interface FormColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  variant?: "native" | "swatches";
  swatches?: string[];
}

export default function FormColorPicker({
  label = "Colour",
  value,
  onChange,
  variant = "native",
  swatches = DEFAULT_SWATCHES,
}: FormColorPickerProps) {
  const { token } = theme.useToken();

  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontSize: 14, color: token.colorTextSecondary }}>
        {label}
      </label>
      {variant === "swatches" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: swatch,
                border: "none",
                cursor: "pointer",
                outline: value === swatch ? `2px solid ${token.colorPrimary}` : "none",
                outlineOffset: 2,
                transition: "transform 0.15s",
              }}
              aria-label={`Select colour ${swatch}`}
            />
          ))}
        </div>
      ) : (
        <Flex align="center" gap={12}>
          <ColorPicker
            value={value}
            onChange={(_, hex) => onChange(hex)}
          />
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{value}</span>
        </Flex>
      )}
    </div>
  );
}
