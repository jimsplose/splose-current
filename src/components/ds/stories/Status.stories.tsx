import type { Meta, StoryObj } from "@storybook/react";
import Status from "../Status";

const meta: Meta<typeof Status> = {
  title: "Design System/Status",
  component: Status,
};

export default meta;
type Story = StoryObj<typeof Status>;

export const Green: Story = { args: { color: "green", label: "Active" } };
export const Red: Story = { args: { color: "red", label: "Cancelled" } };
export const Yellow: Story = { args: { color: "yellow", label: "Pending" } };
export const DotOnly: Story = { args: { color: "blue" } };

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Status color="green" label="Active" />
      <Status color="red" label="Cancelled" />
      <Status color="yellow" label="Pending" />
      <Status color="blue" label="Upcoming" />
      <Status color="gray" label="Draft" />
      <Status color="purple" label="In progress" />
      <Status color="orange" label="Archived" />
    </div>
  ),
};
