import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Breadcrumbs",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Horizontal path indicator for deep detail pages and nested workflows.",
      whatToUseInstead:
        "Raw AntD Breadcrumb imports with per-page separator hacks.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Breadcrumbs.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Breadcrumbs — planned</div>,
};
