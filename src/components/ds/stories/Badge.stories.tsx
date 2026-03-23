import type { Meta, StoryObj } from "@storybook/react";
import Badge, { statusVariant } from "../Badge";

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["green", "red", "blue", "yellow", "orange", "gray", "purple"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Green: Story = {
  args: { variant: "green", children: "Active" },
};

export const Red: Story = {
  args: { variant: "red", children: "Overdue" },
};

export const Blue: Story = {
  args: { variant: "blue", children: "Draft" },
};

export const Yellow: Story = {
  args: { variant: "yellow", children: "Pending" },
};

export const Gray: Story = {
  args: { variant: "gray", children: "Unknown" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="green">Active</Badge>
      <Badge variant="red">Overdue</Badge>
      <Badge variant="blue">Draft</Badge>
      <Badge variant="yellow">Pending</Badge>
      <Badge variant="orange">Archived</Badge>
      <Badge variant="gray">Unknown</Badge>
      <Badge variant="purple">Premium</Badge>
    </div>
  ),
};

export const StatusVariantHelper: Story = {
  render: () => {
    const statuses = ["Active", "Paid", "Draft", "Sent", "Outstanding", "Overdue", "Failed", "Cancelled", "Archived"];
    return (
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <Badge key={s} variant={statusVariant(s)}>{s}</Badge>
        ))}
      </div>
    );
  },
};
