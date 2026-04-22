import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/TimePicker",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Time-of-day input with popover for appointment forms, opening hours, and reminders.",
      whatToUseInstead:
        "Raw AntD TimePicker imports with bespoke format handling per page.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/TimePicker.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>TimePicker — planned</div>,
};
