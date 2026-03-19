import type { Meta, StoryObj } from "@storybook/react";
import Collapse from "../Collapse";

const meta: Meta<typeof Collapse> = {
  title: "Design System/Collapse",
  component: Collapse,
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {
  args: {
    title: "Client alerts",
    children: <p className="text-sm text-text-secondary">No alerts configured.</p>,
  },
};

export const DefaultOpen: Story = {
  args: {
    title: "Stripe integration",
    defaultOpen: true,
    children: <p className="text-sm text-text-secondary">Connected to Stripe account.</p>,
  },
};
