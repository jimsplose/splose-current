import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/AppointmentCard",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Compact calendar/sidebar card rendering a single appointment (colour bar, time, patient, service, status).",
      whatToUseInstead:
        "Inline _calendarEvent_WaeeuXUs markup duplicated in calendar views and patient appointment lists.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/AppointmentCard.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>AppointmentCard — planned</div>,
};
