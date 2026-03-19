import type { Meta, StoryObj } from "@storybook/react";
import FormInput from "../FormInput";

const meta: Meta<typeof FormInput> = {
  title: "Design System/FormInput",
  component: FormInput,
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: { label: "Full name", placeholder: "Enter name..." },
};

export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "Please enter a valid email" },
};

export const NoLabel: Story = {
  args: { placeholder: "Search..." },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <FormInput label="Normal" placeholder="Type here..." />
      <FormInput label="With value" defaultValue="hello@splose.com" />
      <FormInput label="With error" error="This field is required" />
      <FormInput label="Disabled" disabled defaultValue="Cannot edit" />
    </div>
  ),
};
