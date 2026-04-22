import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Accordion",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Vertical list of expandable panels for forms, FAQs, and disclosure sections.",
      whatToUseInstead:
        "Existing Collapse component (renames to Accordion with deprecated alias).",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Accordion.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Accordion — planned</div>,
};
