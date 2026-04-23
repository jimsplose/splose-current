"use client";

import { useRouter } from "next/navigation";
import { DownOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Dropdown, Icon } from "@/components/ds";
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
          // eslint-disable-next-line no-restricted-syntax -- decorative button shadow, Card unsuitable for inline Button
          <Button style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            Pay
            <Icon as={DownOutlined} tone="secondary" />
          </Button>
        }
        items={payItems}
        onSelect={handlePaySelect}
        align="right"
      />
      {/* eslint-disable-next-line no-restricted-syntax -- decorative button shadow */}
      <Button style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <Icon as={MailOutlined} size="lg" tone="secondary" />
        Email Invoice
      </Button>
      <Dropdown
        trigger={
          // eslint-disable-next-line no-restricted-syntax -- decorative button shadow
          <Button style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            Actions
            <Icon as={DownOutlined} tone="secondary" />
          </Button>
        }
        items={actionsItems}
        onSelect={handleActionsSelect}
        align="right"
      />
    </Flex>
  );
}
