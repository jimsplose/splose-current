import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FileOutlined,
  MailOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Accordion from "../Accordion";
import Card from "../Card";

const meta: Meta<typeof Accordion> = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["extended"],
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    tone: { control: "radio", options: ["default", "subtle"] },
    divider: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    // No direct call sites in src/app/ yet — Collapse is still the in-use single-panel alias.
    appPages: [],
    referenceUrl: "https://ant.design/components/collapse",
    splose: {
      status: "beta",
      summary:
        "Vertical list of expandable panels for forms, FAQs, and disclosure sections.",
      whatToUseInstead:
        "Existing Collapse component (kept as deprecated single-panel alias).",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Accordion.md",
      source: "src/components/ds/Accordion.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const basicItems = [
  { id: "contact", title: "Contact", children: <p>Phone, email, address rows.</p> },
  { id: "clinical", title: "Clinical history", children: <p>Conditions, allergies, referrals.</p> },
  { id: "billing", title: "Billing", children: <p>Payment method, tax ID, invoice defaults.</p> },
];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { items: basicItems, type: "multiple", divider: true, tone: "default" },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Accordion {...args} />
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Single: Story = {
  name: "Feature: Single (one open at a time)",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion type="single" items={basicItems} />
    </div>
  ),
};

export const Multiple: Story = {
  name: "Feature: Multiple",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        type="multiple"
        items={basicItems.map((it, i) => ({ ...it, defaultOpen: i === 0 }))}
      />
    </div>
  ),
};

export const WithDescriptions: Story = {
  name: "Feature: With Descriptions",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        items={[
          {
            id: "a",
            title: "Contact details",
            description: "Phone, email, mailing address.",
            children: <p>Body.</p>,
          },
          {
            id: "b",
            title: "Billing preferences",
            description: "How invoices are delivered and paid.",
            children: <p>Body.</p>,
          },
        ]}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Feature: With Icons",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        items={[
          {
            id: "files",
            title: "Files",
            icon: <Icon as={FileOutlined} size="md" tone="secondary" />,
            children: <p>Uploaded documents.</p>,
          },
          {
            id: "mail",
            title: "Email",
            icon: <Icon as={MailOutlined} size="md" tone="secondary" />,
            children: <p>Emails sent to this patient.</p>,
          },
          {
            id: "settings",
            title: "Settings",
            icon: <Icon as={SettingOutlined} size="md" tone="secondary" />,
            children: <p>Per-patient overrides.</p>,
          },
        ]}
      />
    </div>
  ),
};

export const Subtle: Story = {
  name: "Feature: Subtle (borderless inside Card)",
  render: () => (
    <Card padding="md" style={{ maxWidth: 560 }}>
      <Accordion
        tone="subtle"
        divider={false}
        items={basicItems}
      />
    </Card>
  ),
};

export const Controlled: Story = {
  name: "Feature: Controlled",
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string[]>(["contact"]);
      return (
        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#6E6E64" }}>
            Open: {value.length ? value.join(", ") : "—"}
          </div>
          <Accordion
            items={basicItems}
            value={value}
            onValueChange={(v) => setValue(Array.isArray(v) ? v : [v])}
          />
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientAdditionalDetails: Story = {
  name: "Recipe: Patient Additional Details",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        type="single"
        items={[
          {
            id: "extra",
            title: "Additional details",
            description: "Medicare, NDIS, private health fund",
            children: (
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
                <dt style={{ color: "#6E6E64" }}>Medicare</dt>
                <dd style={{ margin: 0 }}>1234 56789 0</dd>
                <dt style={{ color: "#6E6E64" }}>NDIS</dt>
                <dd style={{ margin: 0 }}>432100000</dd>
                <dt style={{ color: "#6E6E64" }}>Fund</dt>
                <dd style={{ margin: 0 }}>Medibank — HH10</dd>
              </dl>
            ),
          },
        ]}
      />
    </div>
  ),
};

export const IntegrationSettingsList: Story = {
  name: "Recipe: Integration Settings List",
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <Accordion
        items={[
          {
            id: "stripe",
            title: "Stripe",
            description: "Card + terminal payments",
            icon: <Icon as={StarOutlined} size="md" tone="primary" />,
            children: <p>Connected · Account acct_1AbCd2.</p>,
          },
          {
            id: "hicaps",
            title: "HICAPS",
            description: "Claim processing",
            icon: <Icon as={StarOutlined} size="md" tone="secondary" />,
            children: <p>Not connected · Request a terminal.</p>,
          },
          {
            id: "xero",
            title: "Xero",
            description: "Accounting export",
            icon: <Icon as={StarOutlined} size="md" tone="secondary" />,
            children: <p>Not connected.</p>,
          },
        ]}
      />
    </div>
  ),
};

export const AIFeatureSections: Story = {
  name: "Recipe: AI Feature Sections",
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <Accordion
        items={[
          {
            id: "notes",
            title: "AI note suggestions",
            description: "Summarise and structure progress notes.",
            children: <p>Controls to toggle suggestions, templates, and tone.</p>,
            defaultOpen: true,
          },
          {
            id: "chat",
            title: "AI chat assistant",
            description: "Context-aware chat panel.",
            children: <p>Controls for data access, model, and routing.</p>,
          },
          {
            id: "transcription",
            title: "Transcription",
            description: "Record and transcribe sessions.",
            children: <p>Provider, retention, and consent settings.</p>,
          },
        ]}
      />
    </div>
  ),
};
