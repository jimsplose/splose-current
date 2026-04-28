import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "antd";
import FormField from "../FormField";

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["custom"],
  argTypes: {
    label: { control: "text", description: "Field label" },
    error: { control: "text", description: "Error message" },
    hint: { control: "text", description: "Hint text below label" },
    required: { control: "boolean", description: "Show required asterisk" },
  },
  parameters: {
    layout: "centered",
    appPages: [
      { label: "Settings — Forms (edit)", vercel: "https://splose-current.vercel.app/settings/forms/1", localhost: "http://localhost:3000/settings/forms/1", production: "https://acme.splose.com/settings/forms" },
      { label: "Patient form view", vercel: "https://splose-current.vercel.app/patient-form/1/view", localhost: "http://localhost:3000/patient-form/1/view", production: "https://acme.splose.com/patient-form" },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Playground: Story = {
  args: {
    label: "Email address",
    children: <Input placeholder="you@example.com" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email address",
    error: "Please enter a valid email address",
    required: true,
    children: <Input placeholder="you@example.com" status="error" />,
  },
};

export const WithHint: Story = {
  args: {
    label: "ABN",
    hint: "Australian Business Number — 11 digits",
    children: <Input placeholder="12 345 678 901" />,
  },
};

export const Required: Story = {
  args: {
    label: "First name",
    required: true,
    children: <Input placeholder="Enter first name" />,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 320 }}>
      <FormField label="Default">
        <Input placeholder="Default input" />
      </FormField>
      <FormField label="Required" required>
        <Input placeholder="Required input" />
      </FormField>
      <FormField label="With hint" hint="Helper text goes here">
        <Input placeholder="Input with hint" />
      </FormField>
      <FormField label="With error" error="This field is required" required>
        <Input placeholder="Error input" status="error" />
      </FormField>
    </div>
  ),
  parameters: { layout: "padded" },
};
