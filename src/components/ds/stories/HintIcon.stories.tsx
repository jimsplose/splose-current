import type { Meta, StoryObj } from "@storybook/react";
import HintIcon from "../HintIcon";

const meta: Meta<typeof HintIcon> = {
  title: "Design System/HintIcon",
  component: HintIcon,
};
export default meta;
type Story = StoryObj<typeof HintIcon>;

export const Default: Story = {};

export const WithTooltip: Story = {
  args: { tooltip: "This is a helpful hint" },
};

export const InLabel: Story = {
  render: () => (
    <label className="text-label-lg text-text">
      Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
    </label>
  ),
};
