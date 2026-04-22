import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Drawer",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Edge-anchored panel overlay for secondary surfaces like appointment details or filters.",
      whatToUseInstead:
        "Raw AntD Drawer imports and bespoke right-rail layouts (e.g. AppointmentSidePanel).",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Drawer.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Drawer — planned</div>,
};
