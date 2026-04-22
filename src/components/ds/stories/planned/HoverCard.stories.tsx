import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/HoverCard",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Hover-triggered rich preview for patients, appointments, and linked records.",
      whatToUseInstead:
        "Raw AntD Popover with trigger=\"hover\" and manual safe-triangle workarounds.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/HoverCard.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>HoverCard — planned</div>,
};
