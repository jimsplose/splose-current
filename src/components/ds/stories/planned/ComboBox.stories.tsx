import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/ComboBox",
  parameters: {
    splose: {
      status: "planned",
      summary:
        "Filterable text input with dropdown and free-entry support for picker fields.",
      whatToUseInstead:
        "AntD AutoComplete imports with leaking internals and clunky free-entry handling.",
      referenceLibrary: "downshift",
      plan: "docs/ds-plans/ComboBox.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>ComboBox — planned</div>,
};
