import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import NumberInput from "../NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "Forms/NumberInput",
  component: NumberInput,
  tags: ["extended"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    format: {
      control: "select",
      options: ["integer", "decimal", "currency", "percent"],
    },
    currency: { control: "select", options: ["AUD", "USD", "NZD"] },
    showSteppers: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Typed numeric input with stepper controls for currency, percentage, and integer values.",
      whatToUseInstead:
        "<FormInput type=\"number\"> + manual parseFloat() per caller.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/NumberInput.md",
      source: "src/components/ds/NumberInput.tsx",
    },
    appPages: [
      {
        label: "Settings: SMS settings (numeric thresholds)",
        vercel: "https://splose-current.vercel.app/settings/sms-settings",
        production: "https://acme.splose.com/settings/sms-settings",
      },
    ],
    referenceUrl: "https://ant.design/components/input-number",
  },
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    label: "Amount",
    defaultValue: 1234.5,
    size: "md",
    format: "currency",
    currency: "AUD",
    showSteppers: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <NumberInput {...args} />
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Integer: Story = {
  name: "Feature: Integer",
  args: { label: "Quantity", format: "integer", defaultValue: 1, min: 1 },
};

export const Decimal: Story = {
  name: "Feature: Decimal",
  args: { label: "Weight (kg)", format: "decimal", defaultValue: 72.4 },
};

export const Currency: Story = {
  name: "Feature: Currency (AUD)",
  args: {
    label: "Service price",
    format: "currency",
    currency: "AUD",
    defaultValue: 120,
    min: 0,
  },
};

export const Percent: Story = {
  name: "Feature: Percent",
  args: {
    label: "Tax rate",
    format: "percent",
    defaultValue: 10,
    min: 0,
    max: 100,
    step: 0.5,
  },
};

export const WithoutSteppers: Story = {
  name: "Feature: Without Steppers",
  args: {
    label: "Free-entry quantity",
    format: "integer",
    defaultValue: 5,
    showSteppers: false,
  },
};

export const Clamped: Story = {
  name: "Feature: Clamped (min 1, max 100)",
  args: {
    label: "Discount %",
    format: "percent",
    defaultValue: 10,
    min: 1,
    max: 100,
  },
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
      <div style={{ width: 220 }}>
        <NumberInput label="Small" size="sm" defaultValue={10} />
      </div>
      <div style={{ width: 220 }}>
        <NumberInput label="Medium" size="md" defaultValue={10} />
      </div>
      <div style={{ width: 220 }}>
        <NumberInput label="Large" size="lg" defaultValue={10} />
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const ServicePrice: Story = {
  name: "Recipe: Service Price",
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<number | null>(95);
      return (
        <div style={{ maxWidth: 280 }}>
          <NumberInput
            label="Price"
            format="currency"
            currency="AUD"
            value={value}
            onChange={setValue}
            min={0}
            required
          />
        </div>
      );
    };
    return <Inner />;
  },
};

export const InvoiceLineQty: Story = {
  name: "Recipe: Invoice Line Qty",
  render: () => (
    <div style={{ maxWidth: 140 }}>
      <NumberInput
        label="Qty"
        format="integer"
        defaultValue={1}
        min={1}
        max={999}
      />
    </div>
  ),
};

export const DiscountPercent: Story = {
  name: "Recipe: Discount Percent",
  render: () => (
    <div style={{ maxWidth: 160 }}>
      <NumberInput
        label="Discount"
        format="percent"
        defaultValue={0}
        min={0}
        max={100}
        step={5}
      />
    </div>
  ),
};

export const DurationMinutes: Story = {
  name: "Recipe: Duration (minutes)",
  render: () => (
    <div style={{ maxWidth: 160 }}>
      <NumberInput
        label="Duration"
        format="integer"
        defaultValue={60}
        min={5}
        max={240}
        step={5}
        suffix="min"
      />
    </div>
  ),
};
