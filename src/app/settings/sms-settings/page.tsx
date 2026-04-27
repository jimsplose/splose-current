"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { ReadOutlined, CopyOutlined } from "@ant-design/icons";
import { PageHeader, Modal, Card, Divider, FormInput, NumberInput, Checkbox, Text, Stat } from "@/components/ds";
import styles from "./SmsSettings.module.css";

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
    <div className={styles.shell}>
      <PageHeader title="SMS settings">
        <Button>
          <ReadOutlined className={styles.iconBtn} />
          Learn
        </Button>
      </PageHeader>

      {/* SMS credit balance card — inline 200x96, 3px radius, 15px padding */}
      <Card padding="none" className={styles.creditCard}>
        <Stat label="SMS credit balance" value={884} valueStyle={{ fontSize: 24, lineHeight: 1.5715 }} />
      </Card>

      <Divider variant="primary" spacing="sm" />

      {/* Recharge credits section */}
      <div className={styles.section}>
        <Text variant="heading/lg" mb={16}>Recharge credits</Text>
        <div className={styles.creditOptionGroup}>
          {creditOptions.map((option, i) => {
            const isActive = selectedCredits === option.credits;
            const isFirst = i === 0;
            const isLast = i === creditOptions.length - 1;
            const classes = [
              styles.creditOption,
              isFirst ? styles.creditOptionFirst : undefined,
              isLast ? styles.creditOptionLast : undefined,
              isActive ? styles.creditOptionActive : undefined,
            ].filter(Boolean).join(" ");
            return (
              <button
                key={option.credits}
                type="button"
                onClick={() => setSelectedCredits(option.credits)}
                className={classes}
              >
                <span>{option.credits} credits</span>
                <span>{option.price}</span>
              </button>
            );
          })}
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => setShowRechargeConfirm(true)}
          >
            Recharge
          </Button>
        </div>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* SMS pricing section */}
      <div className={styles.contentBlock}>
        <Text variant="heading/lg" mb={16}>SMS pricing</Text>
        <Flex vertical gap={12} className={styles.body}>
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
            <a href="#" className={styles.linkInline}>
              billing history
            </a>
            .
          </p>
        </Flex>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* Low credit balance email reminder */}
      <div className={styles.contentBlockSection}>
        <Checkbox
          checked={lowCreditEnabled}
          onChange={(e) => setLowCreditEnabled(e.target.checked)}
          label="Low credit balance email reminder"
        />
        <p className={styles.helperText}>
          Receive an email reminder when SMS credits go below the level you specify below.
        </p>
        <NumberInput format="integer" defaultValue={100} min={0} className={styles.narrowField} />
      </div>

      {/* Automatic recharge */}
      <div className={styles.contentBlockSection}>
        <Checkbox
          checked={autoRechargeEnabled}
          onChange={(e) => setAutoRechargeEnabled(e.target.checked)}
          label="Automatic recharge"
        />
        <p className={styles.helperText}>
          Automatically recharge SMS credits when the balance reaches the number you specify below.
        </p>
        <NumberInput format="integer" defaultValue={100} min={0} className={styles.narrowFieldSpaced} />
        <NumberInput label="SMS credits to purchase" format="integer" defaultValue={200} min={0} className={styles.narrowFieldSpaced} />
        <Button type="primary">Save</Button>
      </div>

      <Divider variant="primary" spacing="sm" />

      {/* Two-way SMS section */}
      <div className={styles.contentBlock}>
        <Text variant="heading/lg" mb={16}>Two-way SMS</Text>
        <p className={styles.bodyTextSpaced}>
          Enable two-way SMS to receive client replies from the dashboard and send messages
          from a dedicated mobile number. Subscribe to two-way SMS for A$9.90 (GST included) per month.
        </p>
        <div className={styles.numberRow}>
          <Flex align="end" gap={8}>
            <FormInput label="Your number" type="text" defaultValue="+61468039383" className={styles.narrowField} />
            <Button type="text" size="small" className={styles.copyBtn}><CopyOutlined /></Button>
          </Flex>
        </div>
        <p className={styles.helperTextTop}>
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
            <Button onClick={() => setShowRechargeConfirm(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setShowRechargeConfirm(false)}>Recharge</Button>
          </>
        }
      >
        <p className={styles.bodyText}>
          {creditOptions.find((o) => o.credits === selectedCredits)?.price} will be charged to your account.
        </p>
      </Modal>
    </div>
  );
}
