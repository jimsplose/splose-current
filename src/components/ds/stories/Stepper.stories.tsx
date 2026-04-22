import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Stepper from "../Stepper";
import Button from "../Button";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Numbered progress indicator for multi-step flows like onboarding and batch workflows.",
      whatToUseInstead:
        "Hand-rolled numbered-step layouts on onboarding and batch pages.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Stepper.md",
      source: "src/components/ds/Stepper.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

const wizardItems = [
  { id: "clients", label: "Select clients", description: "Pick patients to invoice." },
  { id: "review", label: "Review", description: "Check totals and tax rates." },
  { id: "preview", label: "Preview", description: "Preview each invoice." },
  { id: "send", label: "Send", description: "Email or print." },
];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { items: wizardItems, current: "review", orientation: "horizontal", size: "md" },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Horizontal: Story = {
  name: "Feature: Horizontal",
  render: () => (
    <div style={{ padding: 20 }}>
      <Stepper items={wizardItems} current="preview" />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Feature: Vertical",
  render: () => (
    <div style={{ padding: 20, maxWidth: 360 }}>
      <Stepper items={wizardItems} current="review" orientation="vertical" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Stepper items={wizardItems} current="review" size="sm" />
      <Stepper items={wizardItems} current="review" size="md" />
      <Stepper items={wizardItems} current="review" size="lg" />
    </div>
  ),
};

export const WithError: Story = {
  name: "Feature: With Error",
  render: () => (
    <Stepper
      items={[
        { id: "a", label: "Upload", status: "complete" },
        { id: "b", label: "Validate", status: "error", description: "3 rows rejected." },
        { id: "c", label: "Preview", status: "pending" },
        { id: "d", label: "Submit", status: "pending" },
      ]}
    />
  ),
};

export const Clickable: Story = {
  name: "Feature: Clickable (back-nav)",
  render: () => {
    const Inner = () => {
      const [current, setCurrent] = useState("preview");
      return (
        <Stepper
          items={wizardItems.map((it) => ({
            ...it,
            onClick: () => setCurrent(it.id),
          }))}
          current={current}
        />
      );
    };
    return <Inner />;
  },
};

export const ControlledStatuses: Story = {
  name: "Feature: Controlled Statuses",
  render: () => (
    <Stepper
      items={[
        { id: "a", label: "Personal", status: "complete" },
        { id: "b", label: "Contact", status: "complete" },
        { id: "c", label: "Billing", status: "current" },
        { id: "d", label: "Review", status: "pending" },
      ]}
    />
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const BatchInvoiceWizard: Story = {
  name: "Recipe: Batch Invoice Wizard",
  render: () => {
    const Inner = () => {
      const [current, setCurrent] = useState("review");
      const idx = wizardItems.findIndex((i) => i.id === current);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
          <Stepper items={wizardItems} current={current} />
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            <Button
              variant="secondary"
              disabled={idx === 0}
              onClick={() => setCurrent(wizardItems[Math.max(0, idx - 1)].id)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={idx === wizardItems.length - 1}
              onClick={() => setCurrent(wizardItems[Math.min(wizardItems.length - 1, idx + 1)].id)}
            >
              Next
            </Button>
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

export const NDISBulkUpload: Story = {
  name: "Recipe: NDIS Bulk Upload",
  render: () => (
    <Stepper
      items={[
        { id: "upload", label: "Upload", description: "Drop your NDIS claims CSV." },
        { id: "validate", label: "Validate", description: "Check each line for errors." },
        { id: "preview", label: "Preview", description: "Review before submission." },
        { id: "submit", label: "Submit", description: "Send to NDIS portal." },
      ]}
      current="validate"
      orientation="vertical"
    />
  ),
};

export const PatientOnboarding: Story = {
  name: "Recipe: Patient Onboarding",
  render: () => (
    <Stepper
      items={[
        { id: "personal", label: "Personal", status: "complete" },
        { id: "contact", label: "Contact", status: "complete" },
        { id: "billing", label: "Billing", status: "current" },
        { id: "review", label: "Review", status: "pending" },
      ]}
    />
  ),
};
