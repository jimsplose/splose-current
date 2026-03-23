"use client";

import { useState } from "react";
import { Button, PageHeader, Modal, Card } from "@/components/ds";
import { BookOpen } from "lucide-react";

const creditOptions = [
  { credits: 200, price: "A$22.00" },
  { credits: 500, price: "A$55.00" },
  { credits: 1000, price: "A$110.00" },
  { credits: 2500, price: "A$275.00" },
];

export default function SMSSettingsPage() {
  const [selectedCredits, setSelectedCredits] = useState(200);
  const [showRechargeConfirm, setShowRechargeConfirm] = useState(false);

  return (
    <div className="p-6">
      <PageHeader title="SMS settings">
        <Button variant="secondary">
          <BookOpen className="h-4 w-4" />
          Learn
        </Button>
      </PageHeader>

      {/* SMS credit balance card */}
      <Card padding="none" className="mb-8 inline-block px-5 py-4">
        <p className="text-body-md text-text-secondary">SMS credit balance</p>
        <p className="text-3xl font-bold text-text">884</p>
      </Card>

      {/* Recharge credits section */}
      <div className="mb-8">
        <h2 className="mb-4 text-heading-lg text-text">Recharge credits</h2>
        <div className="mb-4 flex gap-3">
          {creditOptions.map((option) => (
            <button
              key={option.credits}
              onClick={() => setSelectedCredits(option.credits)}
              className={`rounded-lg border px-5 py-3 text-center transition-colors ${
                selectedCredits === option.credits
                  ? "border-primary bg-purple-50 text-primary"
                  : "border-border bg-white text-text hover:border-gray-300"
              }`}
            >
              <p className="text-label-lg">{option.credits} credits</p>
              <p className="text-body-md text-text-secondary">{option.price}</p>
            </button>
          ))}
        </div>
        <Button
          variant="primary"
          onClick={() => setShowRechargeConfirm(true)}
        >
          Recharge
        </Button>
      </div>

      {/* SMS pricing section */}
      <div className="max-w-2xl">
        <h2 className="mb-4 text-heading-lg text-text">SMS pricing</h2>
        <div className="space-y-3 text-body-md text-text-secondary leading-relaxed">
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
            <a href="#" className="text-primary hover:underline">
              billing history
            </a>
            .
          </p>
        </div>
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
