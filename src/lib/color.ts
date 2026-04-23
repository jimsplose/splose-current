/**
 * Compute whether white or dark text should be rendered over a given background
 * colour for WCAG-AA legibility.
 *
 * Used for user-configured tag colours where the background hex is arbitrary
 * (set by clinic admins in /settings/tags). Falls back to dark text for any
 * unparseable input.
 *
 * @example
 * // Inside an AntD Tag render:
 * <Tag style={{ backgroundColor: color, color: pickTextColor(color) }}>VIP</Tag>
 */
export function pickTextColor(color: string | undefined): string {
  if (!color) return "var(--ant-color-text, #414549)";
  const hex = color.trim().replace(/^#/, "");
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    return "var(--ant-color-text, #414549)";
  }
  // Perceived luminance (0–1). <0.55 = dark background → white text.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55 ? "#ffffff" : "var(--ant-color-text, #414549)";
}
