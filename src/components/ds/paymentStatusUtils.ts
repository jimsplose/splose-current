// Pure utility functions for payment status — no React, no browser APIs.
// Safe to import from both server and client components.

export type PaymentStatus =
  | "paid"
  | "outstanding"
  | "overdue"
  | "partial"
  | "refunded"
  | "failed"
  | "draft"
  | "void"
  | "sent"
  | "cancelled";

export type PaymentStatusBadgeSize = "sm" | "md" | "lg";

type BadgeVariant = "green" | "red" | "blue" | "yellow" | "orange" | "gray" | "purple";

export const statusMap: Record<PaymentStatus, { variant: BadgeVariant; label: string; solidBg?: string }> = {
  paid: { variant: "green", label: "Paid", solidBg: "#00c887" },
  outstanding: { variant: "yellow", label: "Outstanding" },
  overdue: { variant: "red", label: "Overdue" },
  partial: { variant: "orange", label: "Partial" },
  refunded: { variant: "blue", label: "Refunded" },
  failed: { variant: "red", label: "Failed" },
  draft: { variant: "gray", label: "Draft" },
  void: { variant: "gray", label: "Void" },
  sent: { variant: "blue", label: "Sent" },
  cancelled: { variant: "red", label: "Cancelled" },
};

/** Map a database invoice status string (e.g. "Paid", "Sent") to a PaymentStatus key. */
export function dbStatusToPaymentStatus(status: string): PaymentStatus {
  switch (status.toLowerCase().replace(/\s+/g, "-")) {
    case "paid": return "paid";
    case "sent": return "sent";
    case "draft": return "draft";
    case "overdue": return "overdue";
    case "outstanding": return "outstanding";
    case "partially-paid": return "partial";
    case "cancelled": return "cancelled";
    case "void": return "void";
    case "refunded": return "refunded";
    default: return "outstanding";
  }
}

/**
 * Imperative mapping for DataTable cell formatters and similar non-JSX
 * contexts — returns the Badge variant + label for a status.
 */
export function paymentStatusToVariant(status: PaymentStatus): {
  variant: BadgeVariant;
  label: string;
} {
  const m = statusMap[status];
  return { variant: m.variant, label: m.label };
}
