import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/SegmentedControl",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Mutually-exclusive option group for 2-4 labelled choices (e.g. Week/Day/Month view switcher).",
      whatToUseInstead:
        "Raw AntD Segmented imports and custom pill-button groups.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/SegmentedControl.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>SegmentedControl — planned</div>,
};
