"use client";

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
  /** "native" shows browser color input, "swatches" shows a swatch grid */
  variant?: "native" | "swatches";
  /** Custom swatch colors (only used with variant="swatches") */
  swatches?: string[];
}

export default function FormColorPicker({
  label = "Colour",
  value,
  onChange,
  variant = "native",
  swatches = DEFAULT_SWATCHES,
}: FormColorPickerProps) {
  return (
    <div>
      <label className="mb-1 block text-label-lg text-text-secondary">{label}</label>
      {variant === "swatches" ? (
        <div className="grid grid-cols-10 gap-2">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              className={`h-7 w-7 rounded-full transition-all ${
                value === swatch ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
              }`}
              style={{ backgroundColor: swatch }}
              aria-label={`Select colour ${swatch}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded border border-border"
          />
          <span className="text-sm text-text-secondary">{value}</span>
        </div>
      )}
    </div>
  );
}
