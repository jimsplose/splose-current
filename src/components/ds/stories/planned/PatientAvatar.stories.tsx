import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/PatientAvatar",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Deterministic initials avatar for patients using a hashed colour palette.",
      whatToUseInstead:
        "Generic <Avatar> with ad-hoc colour logic duplicated per caller.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/PatientAvatar.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>PatientAvatar — planned</div>,
};
