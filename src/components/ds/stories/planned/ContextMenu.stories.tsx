import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/ContextMenu",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Right-click menu for contextual actions on calendar slots, DataTable rows, and notes.",
      whatToUseInstead:
        "No current equivalent — previously handled only by click-triggered Dropdown menus.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/ContextMenu.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>ContextMenu — planned</div>,
};
