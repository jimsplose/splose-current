/**
 * Format a phone number string into a human-readable Australian format.
 * Strips non-digit characters, then formats as mobile (04xx xxx xxx),
 * local landline (0x xxxx xxxx), or passes through unrecognised values.
 *
 * Used on AntD Input onBlur — no E.164 or react-phone-number-input dependency.
 *
 * @example
 * <Input onBlur={e => form.setFieldValue('phone', formatAustralianPhone(e.target.value))} />
 */
export function formatAustralianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  // Mobile: 04xx xxx xxx (10 digits starting with 04)
  if (digits.length === 10 && digits.startsWith("04")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  // Landline: 0x xxxx xxxx (10 digits starting with 0)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  // International or unrecognised — return as-is
  return value;
}

/**
 * Format a Date as a human-readable Australian timestamp.
 * Example: "4:51 pm, 10 Feb 2026"
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
