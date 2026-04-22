import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/CommandPalette",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Cmd+K launcher overlay with fuzzy search across navigation, actions, and recent records.",
      whatToUseInstead:
        "No current equivalent — adds keyboard-first navigation for power users.",
      referenceLibrary: "cmdk",
      plan: "docs/ds-plans/CommandPalette.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>CommandPalette — planned</div>,
};
