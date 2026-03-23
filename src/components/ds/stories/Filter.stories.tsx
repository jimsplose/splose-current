import type { Meta, StoryObj } from "@storybook/react";
import Filter from "../Filter";

const meta: Meta<typeof Filter> = {
  title: "Layout/Filter",
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  args: {
    items: [
      { label: "All", value: "all" },
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
    value: "all",
  },
};

export const TwoOptions: Story = {
  args: {
    items: [
      { label: "Single", value: "single" },
      { label: "Split", value: "split" },
    ],
    value: "single",
  },
};
