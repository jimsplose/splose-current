import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Sparkline",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Tiny inline trend chart for Stat compositions and dashboard metric tiles.",
      whatToUseInstead:
        "Full-size Highcharts embeds for what should be glanceable trend shapes.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/Sparkline.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Sparkline — planned</div>,
};
