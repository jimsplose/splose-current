import type { Meta, StoryObj } from "@storybook/react";
import Divider from "../Divider";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle"],
      description: "Border color intensity",
    },
    spacing: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Vertical margin above and below",
    },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {
  args: { variant: "default", spacing: "md" },
};

export const AllSpacings: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <p className="text-label-md text-text-secondary">spacing=&quot;none&quot;</p>
      <Divider spacing="none" />
      <p className="text-label-md text-text-secondary">spacing=&quot;sm&quot;</p>
      <Divider spacing="sm" />
      <p className="text-label-md text-text-secondary">spacing=&quot;md&quot; (default)</p>
      <Divider spacing="md" />
      <p className="text-label-md text-text-secondary">spacing=&quot;lg&quot;</p>
      <Divider spacing="lg" />
      <p className="text-label-md text-text-secondary">End</p>
    </div>
  ),
};

export const Subtle: Story = {
  args: { variant: "subtle", spacing: "md" },
};
