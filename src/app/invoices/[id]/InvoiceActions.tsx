"use client";

import { useRouter } from "next/navigation";
import { DownOutlined, MailOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Dropdown } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";

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
    <Flex align="center" gap={8}>
      <Dropdown
        trigger={
          <Button variant="secondary" className="shadow-sm">
            Pay
            <DownOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
          </Button>
        }
        items={payItems}
        onSelect={handlePaySelect}
        align="right"
      />
      <Button variant="secondary" className="shadow-sm">
        <MailOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
        Email Invoice
      </Button>
      <Dropdown
        trigger={
          <Button variant="secondary" className="shadow-sm">
            Actions
            <DownOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
          </Button>
        }
        items={actionsItems}
        onSelect={handleActionsSelect}
        align="right"
      />
    </Flex>
  );
}
