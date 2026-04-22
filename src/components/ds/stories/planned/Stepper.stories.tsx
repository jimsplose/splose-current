import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Stepper",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Numbered progress indicator for multi-step flows like onboarding and batch workflows.",
      whatToUseInstead:
        "Hand-rolled numbered-step layouts on onboarding and batch pages.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Stepper.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Stepper — planned</div>,
};
