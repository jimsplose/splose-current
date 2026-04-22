import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Skeleton",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Neutral placeholder that occupies the space of content while it loads.",
      whatToUseInstead:
        "<div className=\"animate-pulse bg-gray-200\" /> and ad-hoc loading rectangles.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Skeleton.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Skeleton — planned</div>,
};
