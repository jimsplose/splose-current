import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/DatePicker",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Single-date input with calendar popover for forms and filters.",
      whatToUseInstead:
        "Raw AntD DatePicker imports with bespoke styling per page.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/DatePicker.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>DatePicker — planned</div>,
};
