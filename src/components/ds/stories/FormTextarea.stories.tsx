import type { Meta, StoryObj } from "@storybook/react";
import FormTextarea from "../FormTextarea";

const meta: Meta<typeof FormTextarea> = {
  title: "Forms/FormTextarea",
  component: FormTextarea,
};
export default meta;
type Story = StoryObj<typeof FormTextarea>;

export const Default: Story = {
  args: { label: "Notes", placeholder: "Enter notes..." },
};

export const WithValue: Story = {
  args: { label: "Description", defaultValue: "This is a sample description that spans multiple lines.", rows: 4 },
};

export const WithError: Story = {
  args: { label: "Notes", error: "This field is required", defaultValue: "" },
};
