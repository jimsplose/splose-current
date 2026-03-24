"use client";

import { useState, useMemo } from "react";
import { Button, PageHeader, Modal, Card } from "@/components/ds";
import { BookOpen, MessageCircle } from "lucide-react";

const creditOptions = [
  { credits: 200, price: "A$22.00" },
  { credits: 500, price: "A$55.00" },
  { credits: 1000, price: "A$110.00" },
  { credits: 2500, price: "A$275.00" },
];

const defaultSampleMessage =
  "Hi {first_name}, this is a reminder about your appointment at {location} on {date} at {time}. Reply YES to confirm or call us on (08) 8123 4567 to reschedule.";

export default function SMSSettingsPage() {
  const [selectedCredits, setSelectedCredits] = useState(200);
  const [showRechargeConfirm, setShowRechargeConfirm] = useState(false);
  const [sampleMessage, setSampleMessage] = useState(defaultSampleMessage);

  const charInfo = useMemo(() => {
    const len = sampleMessage.length;
    const hasSpecial = /[^\u0000-\u007F]/.test(sampleMessage);
    const segmentSize = hasSpecial ? 70 : 160;
    const multiSegmentSize = hasSpecial ? 67 : 153;
    const segments = len <= segmentSize ? 1 : Math.ceil(len / multiSegmentSize);
    return { len, segments, segmentSize, hasSpecial };
  }, [sampleMessage]);

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
            <Button
              key={option.credits}
              variant="secondary"
              onClick={() => setSelectedCredits(option.credits)}
              className={`px-5 py-3 text-center ${
                selectedCredits === option.credits
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:border-gray-300"
              }`}
            >
              <div>
                <p className="text-label-lg">{option.credits} credits</p>
                <p className="text-body-md text-text-secondary">{option.price}</p>
              </div>
            </Button>
          ))}
        </div>
        <Button
          variant="primary"
          onClick={() => setShowRechargeConfirm(true)}
        >
          Recharge
        </Button>
      </div>

      {/* SMS message preview */}
      <div className="mb-8 max-w-2xl">
        <h2 className="mb-4 text-heading-lg text-text">Message preview</h2>
        <div className="mb-3">
          <label className="mb-1 block text-label-lg text-text-secondary">
            Sample message
          </label>
          <textarea
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            rows={3}
            value={sampleMessage}
            onChange={(e) => setSampleMessage(e.target.value)}
          />
        </div>

        {/* Character count and segment info */}
        <div className="mb-4 flex items-center gap-4 text-body-sm text-text-secondary">
          <span>
            {charInfo.len} character{charInfo.len !== 1 ? "s" : ""}
          </span>
          <span className="text-border">|</span>
          <span>
            {charInfo.segments} segment{charInfo.segments !== 1 ? "s" : ""} ({charInfo.segments} credit{charInfo.segments !== 1 ? "s" : ""})
          </span>
          {charInfo.hasSpecial && (
            <>
              <span className="text-border">|</span>
              <span className="text-amber-600">Contains special characters</span>
            </>
          )}
        </div>

        {/* Phone-style preview */}
        <div className="mx-auto w-72 rounded-3xl border-2 border-gray-300 bg-gray-100 p-4">
          <div className="mb-2 flex items-center justify-center gap-1.5 text-caption-md text-text-secondary">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>SMS Preview</span>
          </div>
          <div className="min-h-[80px] rounded-2xl bg-white p-3">
            <div className="inline-block max-w-full rounded-2xl rounded-bl-sm bg-gray-200 px-3 py-2 text-body-sm text-text">
              {sampleMessage || <span className="italic text-text-secondary">Type a message above...</span>}
            </div>
          </div>
        </div>
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
