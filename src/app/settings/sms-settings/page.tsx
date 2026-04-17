"use client";

import { useState } from "react";
import { Flex } from "antd";
import { ReadOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, PageHeader, Modal, Card, Divider, FormInput, Checkbox, Text, Stat } from "@/components/ds";

const creditOptions = [
  { credits: 200, price: "A$22.00" },
  { credits: 500, price: "A$55.00" },
  { credits: 1000, price: "A$110.00" },
  { credits: 2500, price: "A$275.00" },
];


export default function SMSSettingsPage() {
  const [selectedCredits, setSelectedCredits] = useState(200);
  const [showRechargeConfirm, setShowRechargeConfirm] = useState(false);
  const [lowCreditEnabled, setLowCreditEnabled] = useState(true);
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(true);
  return (
    <div className="p-6">
      <PageHeader title="SMS settings">
        <Button variant="secondary">
          <ReadOutlined style={{ fontSize: 16 }} />
          Learn
        </Button>
      </PageHeader>

      {/* SMS credit balance card — inline 200x96, 3px radius, 15px padding */}
      <Card padding="none" style={{ display: "inline-block", borderRadius: 3, padding: "15px", marginBottom: 32, borderColor: "rgb(232,232,232)", minWidth: 200 }}>
        <Stat label="SMS credit balance" value={884} valueStyle={{ fontSize: 24, lineHeight: 1.5715 }} />
      </Card>

      <Divider variant="primary" spacing="sm" />

      {/* Recharge credits section */}
      <div className="mb-8">
        <Text variant="heading/lg" className="mb-4">Recharge credits</Text>
        <div style={{ display: "inline-flex", marginBottom: 16 }}>
          {creditOptions.map((option, i) => {
            const isActive = selectedCredits === option.credits;
            const isFirst = i === 0;
            const isLast = i === creditOptions.length - 1;
            const radius = isFirst
              ? "6px 0 0 6px"
              : isLast
                ? "0 6px 6px 0"
                : "0";
            const borderWidth = isFirst ? "1px" : "1px 1px 1px 0";
            return (
              <button
                key={option.credits}
                type="button"
                onClick={() => setSelectedCredits(option.credits)}
                style={{
                  width: 107,
                  height: 100,
                  padding: "0 15px",
                  borderStyle: "solid",
                  borderWidth,
                  borderColor: isActive ? "rgb(130, 80, 255)" : "rgb(217, 217, 217)",
                  borderRadius: radius,
                  backgroundColor: "rgb(255, 255, 255)",
                  color: isActive ? "rgb(130, 80, 255)" : "rgb(65, 69, 73)",
                  fontSize: 14,
                  fontWeight: 400,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>{option.credits} credits</span>
                <span>{option.price}</span>
              </button>
            );
          })}
        </div>
        <div>
          <Button
            variant="primary"
            onClick={() => setShowRechargeConfirm(true)}
          >
            Recharge
          </Button>
        </div>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* SMS pricing section */}
      <div className="max-w-[672px]">
        <Text variant="heading/lg" className="mb-4">SMS pricing</Text>
        <Flex vertical gap={12} className="text-body-md text-text-secondary" style={{ lineHeight: 1.6 }}>
          <p>
            A standard SMS message contains 160 characters per segment (if a message has more
            than 160 characters, the message is split into segments, each consisting of 153
            characters). SMS messages which include special characters such as emojis require a
            different type of SMS. These messages are able to contain up to 70 characters (Messages
            with special characters longer than 70 characters are split into 67 character segments).
          </p>
          <p>
            Credits are purchased in advance and cost A$0.10 + GST per credit. Outbound SMS
            messages cost one credit per segment, and inbound messages cost 0.5 credits per
            segment. SMS credits purchased get billed to the credit card attached to your splose
            account. Receipts will appear in your{" "}
            <a href="#" className="text-primary">
              billing history
            </a>
            .
          </p>
        </Flex>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* Low credit balance email reminder */}
      <div className="max-w-[672px] mb-6">
        <Checkbox
          checked={lowCreditEnabled}
          onChange={(e) => setLowCreditEnabled(e.target.checked)}
          label="Low credit balance email reminder"
        />
        <p className="text-body-md text-text-secondary mb-3 mt-2">
          Receive an email reminder when SMS credits go below the level you specify below.
        </p>
        <FormInput type="number" defaultValue="100" style={{ maxWidth: 320 }} />
      </div>

      {/* Automatic recharge */}
      <div className="max-w-[672px] mb-6">
        <Checkbox
          checked={autoRechargeEnabled}
          onChange={(e) => setAutoRechargeEnabled(e.target.checked)}
          label="Automatic recharge"
        />
        <p className="text-body-md text-text-secondary mb-3 mt-2">
          Automatically recharge SMS credits when the balance reaches the number you specify below.
        </p>
        <FormInput type="number" defaultValue="100" style={{ maxWidth: 320, marginBottom: 16 }} />
        <FormInput label="SMS credits to purchase" type="number" defaultValue="200" style={{ maxWidth: 320, marginBottom: 16 }} />
        <Button variant="primary">Save</Button>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* Two-way SMS section */}
      <div className="max-w-[672px]">
        <Text variant="heading/lg" className="mb-4">Two-way SMS</Text>
        <p className="text-body-md text-text-secondary mb-4">
          Enable two-way SMS to receive client replies from the dashboard and send messages
          from a dedicated mobile number. Subscribe to two-way SMS for A$9.90 (GST included) per month.
        </p>
        <div className="mb-2">
          <Flex align="end" gap={8}>
            <FormInput label="Your number" type="text" defaultValue="+61468039383" style={{ maxWidth: 320 }} />
            <Button variant="ghost" size="sm" style={{ marginBottom: 4 }}><CopyOutlined /></Button>
          </Flex>
        </div>
        <p className="text-body-md text-text-secondary mt-2">
          Contact the account owner to enable two-way SMS.
        </p>
      </div>

      <Modal
        open={showRechargeConfirm}
        onClose={() => setShowRechargeConfirm(false)}
        title={`Recharge ${selectedCredits} credits?`}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRechargeConfirm(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowRechargeConfirm(false)}>Recharge</Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          {creditOptions.find((o) => o.credits === selectedCredits)?.price} will be charged to your account.
        </p>
      </Modal>
    </div>
  );
}
