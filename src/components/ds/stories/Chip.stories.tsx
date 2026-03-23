import type { Meta, StoryObj } from "@storybook/react";
import Chip from "../Chip";

const meta: Meta<typeof Chip> = {
  title: "Layout/Chip",
  component: Chip,
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Green: Story = { args: { variant: "green", children: "East Clinics" } };
export const Purple: Story = { args: { variant: "purple", children: "Physio" } };
export const Yellow: Story = { args: { variant: "yellow", children: "Booking for Jim" } };

export const WithRemove: Story = {
  args: { variant: "yellow", children: "Filter tag", onRemove: () => alert("removed") },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="green">Green</Chip>
      <Chip variant="purple">Purple</Chip>
      <Chip variant="yellow">Yellow</Chip>
      <Chip variant="blue">Blue</Chip>
      <Chip variant="red">Red</Chip>
      <Chip variant="gray">Gray</Chip>
      <Chip variant="yellow" onRemove={() => {}}>Removable</Chip>
    </div>
  ),
};
