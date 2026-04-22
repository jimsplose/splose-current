import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/PaymentStatusBadge",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Purpose-built badge for invoice payment status (Paid, Outstanding, Overdue, Partial, Refunded, Failed, Draft).",
      whatToUseInstead:
        "<Badge variant=...> + statusVariant() lookup tables duplicated per caller.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/PaymentStatusBadge.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>PaymentStatusBadge — planned</div>,
};
