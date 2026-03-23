import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "../SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Forms/SearchBar",
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: { placeholder: "Search clients..." },
};

export const WithDefaultValue: Story = {
  args: { placeholder: "Search...", defaultValue: "John Smith" },
};
