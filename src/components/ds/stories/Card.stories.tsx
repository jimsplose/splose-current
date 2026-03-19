import type { Meta, StoryObj } from "@storybook/react";
import Card from "../Card";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <p className="text-sm text-text-secondary">Card content goes here.</p>,
  },
};

export const WithTitle: Story = {
  args: {
    title: "SMS Balance",
    children: <p className="text-2xl font-bold text-text">884 credits</p>,
  },
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    title: "Quick stats",
    children: <p className="text-sm text-text-secondary">Compact card.</p>,
  },
};
