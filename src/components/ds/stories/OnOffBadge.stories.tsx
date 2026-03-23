import type { Meta, StoryObj } from "@storybook/react";
import OnOffBadge from "../OnOffBadge";

const meta: Meta<typeof OnOffBadge> = {
  title: "Design System/OnOffBadge",
  component: OnOffBadge,
};
export default meta;
type Story = StoryObj<typeof OnOffBadge>;

export const On: Story = { args: { value: true } };
export const Off: Story = { args: { value: false } };
export const YesNo: Story = { args: { value: true, onLabel: "Yes", offLabel: "No" } };
export const ActiveInactive: Story = { args: { value: false, onLabel: "Active", offLabel: "Inactive" } };
