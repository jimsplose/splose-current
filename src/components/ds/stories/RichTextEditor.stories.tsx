import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Forms/RichTextEditor",
  component: RichTextEditor,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <RichTextEditor value={value} onChange={setValue} />;
  },
};

export const WithVariables: Story = {
  name: "With Variables",
  render: () => {
    const [value, setValue] = useState("<p>Hi {patient_name},</p><p>Your next appointment is on {appointment_date}.</p>");
    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        variables={["patient_name", "appointment_date", "practitioner_name", "location", "service_type"]}
      />
    );
  },
};

export const WithPlaceholder: Story = {
  name: "With Placeholder",
  render: () => {
    const [value, setValue] = useState("");
    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Write your email body here..."
        rows={6}
      />
    );
  },
};
