import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from "../Dropdown";
import Button from "../Button";

const meta: Meta<typeof Dropdown> = {
  title: "Design System/Dropdown",
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "Change log", value: "changelog" },
      { label: "Archive", value: "archive", divider: true },
      { label: "Delete", value: "delete", danger: true },
    ],
    onSelect: (v: string) => alert(v),
  },
};

export const RightAligned: Story = {
  args: {
    trigger: <Button variant="secondary">Menu</Button>,
    items: [
      { label: "View", value: "view" },
      { label: "Edit", value: "edit" },
    ],
    align: "right",
    onSelect: (v: string) => alert(v),
  },
};
