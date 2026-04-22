import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import PhoneInput from "../PhoneInput";

const meta: Meta<typeof PhoneInput> = {
  title: "Forms/PhoneInput",
  component: PhoneInput,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Formatted phone input with country-code awareness and E.164 normalisation.",
      whatToUseInstead:
        "<FormInput type=\"tel\"> with manual country handling and inconsistent storage.",
      referenceLibrary: "react-phone-number-input",
      plan: "docs/ds-plans/PhoneInput.md",
      source: "src/components/ds/PhoneInput.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof PhoneInput>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>("+61412345678");
      return (
        <div style={{ maxWidth: 320 }}>
          <PhoneInput
            label="Mobile"
            value={value}
            onChange={setValue}
            defaultCountry="AU"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#6E6E64" }}>
            E.164: {value ?? "(empty)"}
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Empty: Story = {
  name: "Feature: Empty",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput label="Mobile" />
    </div>
  ),
};

export const Filled: Story = {
  name: "Feature: Filled (AU)",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput label="Mobile" defaultValue="+61412345678" defaultCountry="AU" />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput label="Mobile" defaultValue="+61412345678" disabled />
    </div>
  ),
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput
        label="Mobile"
        defaultValue="+6112"
        required
        error="Enter a valid Australian mobile number."
      />
    </div>
  ),
};

export const DefaultAU: Story = {
  name: "Feature: Default AU",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput label="AU mobile" defaultCountry="AU" defaultValue="+61412345678" />
    </div>
  ),
};

export const NZFlag: Story = {
  name: "Feature: NZ",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput label="NZ mobile" defaultCountry="NZ" defaultValue="+64212345678" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <PhoneInput size="sm" label="Small" defaultValue="+61412345678" />
      <PhoneInput size="md" label="Medium" defaultValue="+61412345678" />
      <PhoneInput size="lg" label="Large" defaultValue="+61412345678" />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientMobile: Story = {
  name: "Recipe: Patient Mobile",
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <div style={{ maxWidth: 320 }}>
          <PhoneInput
            label="Mobile"
            value={value}
            onChange={setValue}
            required
            hint="We'll use this for appointment reminders."
          />
        </div>
      );
    };
    return <Inner />;
  },
};

export const ContactPhone: Story = {
  name: "Recipe: Contact Phone",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput
        label="Phone"
        defaultValue="+61298765432"
        defaultCountry="AU"
      />
    </div>
  ),
};

export const LocationPhone: Story = {
  name: "Recipe: Location Phone",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <PhoneInput
        label="Clinic phone"
        defaultValue="+61398765432"
        hint="Shown on invoices and SMS reminders."
      />
    </div>
  ),
};
