import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";

const meta: Meta<typeof List> = {
  title: "Design System/List",
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  args: {
    items: [
      { label: "Name", value: "Sarah Johnson" },
      { label: "Email", value: "sarah@example.com" },
      { label: "Phone", value: "0412 345 678" },
      { label: "DOB", value: "15 Mar 1990" },
    ],
  },
};

export const WideLabel: Story = {
  args: {
    labelWidth: "w-40",
    items: [
      { label: "Medicare number", value: "1234 56789 0" },
      { label: "Reference number", value: "1" },
      { label: "Expiry date", value: "01/2027" },
    ],
  },
};
