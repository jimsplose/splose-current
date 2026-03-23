"use client";

import { useRouter } from "next/navigation";
import { Button, Dropdown } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import { ChevronDown, Mail } from "lucide-react";

const payItems: DropdownItem[] = [
  { label: "Record payment", value: "record-payment" },
  { label: "Send payment link", value: "send-payment-link" },
];

const actionsItems: DropdownItem[] = [
  { label: "Duplicate invoice", value: "duplicate" },
  { label: "Credit note", value: "credit-note" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Void", value: "void", danger: true },
];

export default function InvoiceActions() {
  const router = useRouter();

  function handlePaySelect(value: string) {
    if (value === "record-payment") {
      router.push("/payments/new");
    }
    // "send-payment-link" is a no-op
  }

  function handleActionsSelect(_value: string) {
    // All actions are no-ops in the prototype
  }

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        trigger={
          <Button variant="secondary" className="shadow-sm">
            Pay
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
          </Button>
        }
        items={payItems}
        onSelect={handlePaySelect}
        align="right"
      />
      <Button variant="secondary" className="shadow-sm">
        <Mail className="h-4 w-4 text-text-secondary" />
        Email Invoice
      </Button>
      <Dropdown
        trigger={
          <Button variant="secondary" className="shadow-sm">
            Actions
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
          </Button>
        }
        items={actionsItems}
        onSelect={handleActionsSelect}
        align="right"
      />
    </div>
  );
}
