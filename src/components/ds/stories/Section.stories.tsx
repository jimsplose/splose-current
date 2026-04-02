import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    headerBar: { control: "boolean" },
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Playground: Story = {
  args: {
    title: "Personal details",
    children: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormInput label="First name" placeholder="Enter first name" />
        <FormInput label="Last name" placeholder="Enter last name" />
        <FormInput label="Email" placeholder="you@example.com" />
        <FormInput label="Phone" placeholder="04XX XXX XXX" />
      </div>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    title: "Notification preferences",
    description: "Choose how you'd like to receive notifications from Splose.",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormSelect label="Email frequency" options={[{ value: "daily", label: "Daily digest" }, { value: "instant", label: "Instant" }, { value: "off", label: "Off" }]} />
        <FormSelect label="SMS alerts" options={[{ value: "on", label: "On" }, { value: "off", label: "Off" }]} />
      </div>
    ),
  },
};

export const WithHeaderBar: Story = {
  args: {
    title: "Billing information",
    headerBar: true,
    children: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormInput label="ABN" placeholder="12 345 678 901" />
        <FormInput label="Business name" placeholder="Enter business name" />
      </div>
    ),
  },
};

/*  Source: /settings pages — form sections with title + description  */
export const SettingsFormSection: Story = {
  name: "Recipe: Settings Form",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
      <Section title="Practice details" description="Basic information about your practice.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormInput label="Practice name" placeholder="Splose OT" />
          <FormInput label="ABN" placeholder="12 345 678 901" />
          <FormInput label="Phone" placeholder="03 9123 4567" />
          <FormInput label="Email" placeholder="admin@splose.com" />
        </div>
      </Section>
      <Section title="Address">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormInput label="Street" placeholder="123 Health St" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <FormInput label="Suburb" placeholder="Richmond" />
            <FormSelect label="State" options={[{ value: "VIC", label: "VIC" }, { value: "NSW", label: "NSW" }, { value: "QLD", label: "QLD" }]} />
            <FormInput label="Postcode" placeholder="3121" />
          </div>
        </div>
      </Section>
    </div>
  ),
};
