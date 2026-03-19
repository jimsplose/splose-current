import type { Meta, StoryObj } from "@storybook/react";
import Tab from "../Tab";

const meta: Meta<typeof Tab> = {
  title: "Design System/Tab",
  component: Tab,
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    items: [
      { label: "Preferences", value: "preferences" },
      { label: "Saved prompts", value: "prompts" },
      { label: "AI block library", value: "blocks", badge: "BETA" },
    ],
    value: "preferences",
  },
};

export const TwoTabs: Story = {
  args: {
    items: [
      { label: "Screener", value: "screener" },
      { label: "Waitlist", value: "waitlist" },
    ],
    value: "screener",
  },
};
