import type { Meta, StoryObj } from "@storybook/react";
import FormLabel from "../FormLabel";
import FormInput from "../FormInput";

const meta: Meta<typeof FormLabel> = {
  title: "Forms/FormLabel",
  component: FormLabel,
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    mb: { control: "number" },
    required: { control: "boolean" },
    hint: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FormLabel>;

export const Playground: Story = {
  args: {
    children: "Field label",
    size: "md",
    mb: 4,
  },
};

export const Default: Story = {
  render: () => <FormLabel>First name</FormLabel>,
};

export const WithRequired: Story = {
  name: "With required asterisk",
  render: () => <FormLabel required>Email address</FormLabel>,
};

export const WithHint: Story = {
  name: "With hint tooltip",
  render: () => (
    <FormLabel hint="This is used for Australian Tax Office reporting">
      ABN
    </FormLabel>
  ),
};

export const CompactSize: Story = {
  name: "Compact (size=sm)",
  render: () => <FormLabel size="sm" mb={8}>Compact label (12px/500)</FormLabel>,
};

export const SettingsFormRow: Story = {
  name: "Recipe: Settings Form Row",
  render: () => (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16, padding: 24, border: "1px solid var(--color-border)", borderRadius: 8, background: "#fff" }}>
      <div>
        <FormLabel htmlFor="first-name" required>First name</FormLabel>
        <FormInput id="first-name" placeholder="e.g. Sarah" />
      </div>
      <div>
        <FormLabel htmlFor="abn" hint="Your 11-digit Australian Business Number">ABN</FormLabel>
        <FormInput id="abn" placeholder="e.g. 12 345 678 901" />
      </div>
      <div>
        <FormLabel htmlFor="website" size="sm" mb={8}>Website</FormLabel>
        <FormInput id="website" placeholder="https://" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
