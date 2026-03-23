import type { Meta, StoryObj } from "@storybook/react";
import ColorDot from "../ColorDot";

const meta: Meta<typeof ColorDot> = {
  title: "Data Display/ColorDot",
  component: ColorDot,
};
export default meta;
type Story = StoryObj<typeof ColorDot>;

export const Small: Story = { args: { color: "#ef4444", size: "sm" } };
export const Medium: Story = { args: { color: "#3b82f6", size: "md" } };
export const Large: Story = { args: { color: "#22c55e", size: "lg" } };

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ColorDot color="#ef4444" />
      <ColorDot color="#f59e0b" />
      <ColorDot color="#22c55e" />
      <ColorDot color="#3b82f6" />
      <ColorDot color="#8b5cf6" />
      <ColorDot color="#6b7280" />
    </div>
  ),
};
