import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/PhoneInput",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Formatted phone input with country-code picker and E.164 normalisation.",
      whatToUseInstead:
        "<FormInput type=\"tel\"> with manual country handling and inconsistent storage.",
      referenceLibrary: "react-phone-number-input",
      plan: "docs/ds-plans/PhoneInput.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>PhoneInput — planned</div>,
};
