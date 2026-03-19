import type { Meta, StoryObj } from "@storybook/react";
import Toggle from "../Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Design System/Toggle",
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const On: Story = { args: { checked: true } };
export const Off: Story = { args: { checked: false } };
export const WithLabel: Story = { args: { checked: true, label: "Enable voice-to-text" } };
export const Disabled: Story = { args: { checked: false, disabled: true, label: "Disabled toggle" } };
