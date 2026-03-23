import type { Meta, StoryObj } from "@storybook/react";
import DateRangeFilter from "../DateRangeFilter";

const meta: Meta<typeof DateRangeFilter> = {
  title: "Layout/DateRangeFilter",
  component: DateRangeFilter,
};

export default meta;
type Story = StoryObj<typeof DateRangeFilter>;

export const Default: Story = {
  args: {
    startDate: "2026-03-01",
    endDate: "2026-03-19",
  },
};
