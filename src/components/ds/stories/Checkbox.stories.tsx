import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "I agree to the terms and conditions" },
};

export const Checked: Story = {
  args: { label: "Email notifications", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Cannot change this", disabled: true, defaultChecked: true },
};
