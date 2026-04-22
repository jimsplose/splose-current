import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Tag",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "User-generated colour-coded label for patient categorisation and record metadata.",
      whatToUseInstead:
        "<Badge variant=...> misused for user tags; raw AntD Tag imports.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Tag.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Tag — planned</div>,
};
