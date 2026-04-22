import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/SignaturePad",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Drawable canvas that captures a handwritten signature for invoices and consent forms.",
      whatToUseInstead:
        "No current equivalent — signatures handled out-of-app or typed today.",
      referenceLibrary: "signature-pad",
      plan: "docs/ds-plans/SignaturePad.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>SignaturePad — planned</div>,
};
