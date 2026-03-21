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
