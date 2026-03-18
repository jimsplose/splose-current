import type { Meta, StoryObj } from "@storybook/react";
import FormSelect from "../FormSelect";

const meta: Meta<typeof FormSelect> = {
  title: "Design System/FormSelect",
  component: FormSelect,
};

export default meta;
type Story = StoryObj<typeof FormSelect>;

const countryOptions = [
  { value: "au", label: "Australia" },
  { value: "nz", label: "New Zealand" },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
];

export const Default: Story = {
  args: { label: "Country", options: countryOptions },
};

export const NoLabel: Story = {
  args: { options: countryOptions },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <FormSelect
        label="Practitioner"
        options={[
          { value: "dr-smith", label: "Dr. Sarah Smith" },
          { value: "dr-chen", label: "Dr. Michael Chen" },
          { value: "dr-wilson", label: "Dr. Emma Wilson" },
        ]}
      />
      <FormSelect
        label="Service"
        options={[
          { value: "initial", label: "Initial Consultation" },
          { value: "followup", label: "Follow-up" },
          { value: "review", label: "Plan Review" },
        ]}
      />
    </div>
  ),
};
