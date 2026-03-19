import type { Meta, StoryObj } from "@storybook/react";
import Select from "../Select";

const meta: Meta<typeof Select> = {
  title: "Design System/Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: [
      { label: "Sarah Johnson", value: "1" },
      { label: "Mark Chen", value: "2" },
      { label: "Alice Brown", value: "3" },
    ],
    value: "",
    placeholder: "Select client...",
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    label: "Client",
    options: [
      { label: "Sarah Johnson", value: "1" },
      { label: "Mark Chen", value: "2" },
      { label: "Alice Brown", value: "3" },
      { label: "Bob Wilson", value: "4" },
      { label: "Carol Davis", value: "5" },
    ],
    value: "",
    placeholder: "Search clients...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Practitioner",
    options: [
      { label: "Dr. Smith", value: "1" },
      { label: "Dr. Jones", value: "2" },
    ],
    value: "1",
  },
};
