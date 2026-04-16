"use client";

import { useState } from "react";
import { Flex } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { Button, PageHeader, Modal, Card, Divider, FormInput, Toggle } from "@/components/ds";

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

      {/* SMS credit balance card */}
      <Card padding="none" className="inline-block" style={{ padding: '16px 20px', marginBottom: 32 }}>
        <p className="text-body-md text-text-secondary">SMS credit balance</p>
        <p style={{ fontSize: '1.875rem', fontWeight: 700 }} className="text-text">884</p>
      </Card>

      <Divider variant="primary" spacing="sm" />

      {/* Recharge credits section */}
      <div className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Recharge credits</h2>
        <Flex gap={12} className="mb-4">
          {creditOptions.map((option) => (
            <Button
              key={option.credits}
              variant="secondary"
              className="text-center"
              onClick={() => setSelectedCredits(option.credits)}
              style={{
                paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12,
                ...(selectedCredits === option.credits
                  ? { borderColor: 'var(--color-primary)', backgroundColor: 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.1)', color: 'var(--color-primary)' }
                  : {}),
              }}
            >
              <div>
                <p className="text-label-lg">{option.credits} credits</p>
                <p className="text-body-md text-text-secondary">{option.price}</p>
              </div>
            </Button>
          ))}
        </Flex>
        <Button
          variant="primary"
          onClick={() => setShowRechargeConfirm(true)}
        >
          Recharge
        </Button>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* SMS pricing section */}
      <div className="max-w-[672px]">
        <h2 className="mb-4 text-heading-lg text-text">SMS pricing</h2>
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
        <Flex align="center" gap={8} className="mb-2">
          <Toggle checked={lowCreditEnabled} onChange={setLowCreditEnabled} />
          <span className="text-body-md text-text">Low credit balance email reminder</span>
        </Flex>
        <p className="text-body-md text-text-secondary mb-3">
          Receive an email reminder when SMS credits go below the level you specify below.
        </p>
        <FormInput type="number" defaultValue="100" style={{ maxWidth: 320 }} />
      </div>

      {/* Automatic recharge */}
      <div className="max-w-[672px] mb-6">
        <Flex align="center" gap={8} className="mb-2">
          <Toggle checked={autoRechargeEnabled} onChange={setAutoRechargeEnabled} />
          <span className="text-body-md text-text">Automatic recharge</span>
        </Flex>
        <p className="text-body-md text-text-secondary mb-3">
          Automatically recharge SMS credits when the balance reaches the number you specify below.
        </p>
        <FormInput type="number" defaultValue="100" style={{ maxWidth: 320, marginBottom: 16 }} />
        <FormInput label="SMS credits to purchase" type="number" defaultValue="200" style={{ maxWidth: 320, marginBottom: 16 }} />
        <Button variant="primary">Save</Button>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* Two-way SMS section */}
      <div className="max-w-[672px]">
        <h2 className="mb-4 text-heading-lg text-text">Two-way SMS</h2>
        <p className="text-body-md text-text-secondary mb-4">
          Enable two-way SMS to receive client replies from the dashboard and send messages
          from a dedicated mobile number. Subscribe to two-way SMS for A$9.90 (GST included) per month.
        </p>
        <div className="mb-2">
          <label className="text-label-lg text-text mb-1 block">Your number</label>
          <Flex align="center" gap={8}>
            <FormInput type="text" defaultValue="+61468039383" style={{ maxWidth: 320 }} />
            <Button variant="ghost" size="sm"><CopyOutlined /></Button>
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
