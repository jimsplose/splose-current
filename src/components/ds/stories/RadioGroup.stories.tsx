import type { Meta, StoryObj } from "@storybook/react";
import RadioGroup from "../RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    name: "frequency",
    label: "Reminder frequency",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
    ],
  },
};

export const WithValue: Story = {
  args: {
    name: "status",
    label: "Appointment status",
    options: [
      { value: "confirmed", label: "Confirmed" },
      { value: "pending", label: "Pending" },
      { value: "cancelled", label: "Cancelled" },
    ],
    value: "confirmed",
  },
};

export const Horizontal: Story = {
  args: {
    name: "view",
    label: "Calendar view",
    options: [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ],
    value: "week",
    className: "[&>div]:flex [&>div]:gap-4 [&>div]:space-y-0",
  },
};
