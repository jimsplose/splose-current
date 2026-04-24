"use client";

import Badge from "./Badge";
import { statusMap } from "./paymentStatusUtils";
import type { PaymentStatus, PaymentStatusBadgeSize } from "./paymentStatusUtils";
export type { PaymentStatus, PaymentStatusBadgeSize } from "./paymentStatusUtils";
export { dbStatusToPaymentStatus, paymentStatusToVariant } from "./paymentStatusUtils";

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: PaymentStatusBadgeSize;
  /** Solid-fill default matches production invoice list. Set `false` for outlined variant. */
  solid?: boolean;
  className?: string;
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
