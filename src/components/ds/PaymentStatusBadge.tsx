"use client";

import Badge from "./Badge";
import type { BadgeVariant } from "./Badge";

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

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: PaymentStatusBadgeSize;
  /** Solid-fill default matches production invoice list. Set `false` for outlined variant. */
  solid?: boolean;
  className?: string;
}

const statusMap: Record<PaymentStatus, { variant: BadgeVariant; label: string; solidBg?: string }> = {
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

/**
 * Purpose-built badge for invoice/payment status. Encodes the Splose
 * colour + label mapping for `paid`, `outstanding`, `overdue`, `partial`,
 * `refunded`, `failed`, `draft`, `void`. Thin wrapper over `Badge` — use
 * this at every invoice/payment render site rather than `Badge variant={...}
 * + statusVariant()` for intent clarity and single-point-of-change.
 */
export default function PaymentStatusBadge({
  status,
  size = "sm",
  solid = true,
  className,
}: PaymentStatusBadgeProps) {
  const m = statusMap[status];
  return (
    <Badge
      variant={m.variant}
      size={size}
      solid={solid}
      solidBg={solid ? m.solidBg : undefined}
      className={className}
    >
      {m.label}
    </Badge>
  );
}
