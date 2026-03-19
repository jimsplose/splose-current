import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Design System/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = { args: { name: "Sarah Johnson" } };
export const CustomColor: Story = { args: { name: "Mark Chen", color: "#22c55e" } };
export const Small: Story = { args: { name: "Alice Brown", size: "sm" } };
export const Large: Story = { args: { name: "Bob Wilson", size: "lg", color: "#f59e0b" } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Sarah Johnson" size="sm" />
      <Avatar name="Sarah Johnson" size="md" />
      <Avatar name="Sarah Johnson" size="lg" />
    </div>
  ),
};
