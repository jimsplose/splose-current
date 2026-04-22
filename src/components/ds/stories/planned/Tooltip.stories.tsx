import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Tooltip",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Hover/focus label for icon-only buttons, truncated text, and abbreviations.",
      whatToUseInstead:
        "Native title attribute; raw AntD Tooltip imports.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Tooltip.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Tooltip — planned</div>,
};
