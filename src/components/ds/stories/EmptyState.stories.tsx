import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "../EmptyState";
import Button from "../Button";

const meta: Meta<typeof EmptyState> = {
  title: "Design System/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    message: "No invoices found.",
  },
};

export const WithAction: Story = {
  args: {
    message: "No payments yet.",
    action: <Button variant="primary">Add payment</Button>,
  },
};

export const WithTitle: Story = {
  args: {
    title: "No results",
    message: "Try adjusting your search or filters.",
  },
};
