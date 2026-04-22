import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/NumberInput",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Typed numeric input with stepper controls for currency, percentage, and integer values.",
      whatToUseInstead:
        "<FormInput type=\"number\"> + manual parseFloat() per caller.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/NumberInput.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>NumberInput — planned</div>,
};
