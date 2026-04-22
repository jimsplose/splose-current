import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Toast",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Short, auto-dismissing notification pinned to the bottom-right for success/error confirmations.",
      whatToUseInstead:
        "AntD message.success / notification.info calls scattered across pages.",
      referenceLibrary: "sonner",
      plan: "docs/ds-plans/Toast.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Toast — planned</div>,
};
