"use client";

import { useState, useMemo } from "react";
import { Flex } from "antd";
import { ReadOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, PageHeader, Modal, Card } from "@/components/ds";

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
    <div style={{ padding: 24 }}>
      <PageHeader title="SMS settings">
        <Button variant="secondary">
          <ReadOutlined style={{ fontSize: 16 }} />
          Learn
        </Button>
      </PageHeader>

      {/* SMS credit balance card */}
      <Card padding="none" style={{ display: 'inline-block', padding: '16px 20px', marginBottom: 32 }}>
        <p className="text-body-md text-text-secondary">SMS credit balance</p>
        <p style={{ fontSize: '1.875rem', fontWeight: 700 }} className="text-text">884</p>
      </Card>

      {/* Recharge credits section */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Recharge credits</h2>
        <Flex gap={12} style={{ marginBottom: 16 }}>
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
        </Flex>
        <Button
          variant="primary"
          onClick={() => setShowRechargeConfirm(true)}
        >
          Recharge
        </Button>
      </div>

      {/* SMS message preview */}
      <div style={{ marginBottom: 32, maxWidth: 672 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Message preview</h2>
        <div style={{ marginBottom: 12 }}>
          <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--ant-color-text-secondary)' }}>
            Sample message
          </label>
          <textarea
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--ant-color-border)', backgroundColor: 'white', padding: '8px 12px', outline: 'none' }}
            className="text-body-md text-text focus:border-primary focus:ring-1 focus:ring-primary/20"
            rows={3}
            value={sampleMessage}
            onChange={(e) => setSampleMessage(e.target.value)}
          />
        </div>

        {/* Character count and segment info */}
        <Flex align="center" gap={16} style={{ marginBottom: 16 }} className="text-body-sm text-text-secondary">
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
        </Flex>

        {/* Phone-style preview */}
        <div style={{ width: 288, margin: '0 auto', borderRadius: 24, border: '2px solid #d1d5db', backgroundColor: '#f3f4f6', padding: 16 }}>
          <Flex justify="center" align="center" gap={6} className="text-caption-md text-text-secondary" style={{ marginBottom: 8 }}>
            <MessageOutlined style={{ fontSize: 14 }} />
            <span>SMS Preview</span>
          </Flex>
          <div style={{ minHeight: 80, borderRadius: 16, backgroundColor: 'white', padding: 12 }}>
            <div style={{ display: 'inline-block', maxWidth: '100%', borderRadius: 16, borderBottomLeftRadius: 4, backgroundColor: '#e5e7eb', padding: '8px 12px' }} className="text-body-sm text-text">
              {sampleMessage || <span style={{ fontStyle: 'italic' }} className="text-text-secondary">Type a message above...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* SMS pricing section */}
      <div style={{ maxWidth: 672 }}>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>SMS pricing</h2>
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
            <a href="#" className="text-primary hover:underline">
              billing history
            </a>
            .
          </p>
        </Flex>
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
