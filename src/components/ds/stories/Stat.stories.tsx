import type { Meta, StoryObj } from "@storybook/react";
import Stat from "../Stat";

const meta: Meta<typeof Stat> = {
  title: "Design System/Stat",
  component: Stat,
};
export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = { args: { value: 42, label: "Appointments" } };

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-6">
      <Stat value={12} label="Appointments" />
      <Stat value={8} label="Notes" />
      <Stat value={3} label="Invoices" />
    </div>
  ),
};
