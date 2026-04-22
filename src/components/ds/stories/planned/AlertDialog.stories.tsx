import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/AlertDialog",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Imperative confirmation overlay for destructive or consequential actions.",
      whatToUseInstead:
        "Modal.confirm() calls and ad-hoc confirmation modals inline in components.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/AlertDialog.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>AlertDialog — planned</div>,
};
