import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ReorderModal, { type ReorderItem } from "../ReorderModal";
import Button from "../Button";

const meta: Meta<typeof ReorderModal> = {
  title: "Overlays/ReorderModal",
  component: ReorderModal,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ReorderModal>;

const sampleItems: ReorderItem[] = [
  { id: "1", label: "Full name" },
  { id: "2", label: "Date of birth" },
  { id: "3", label: "Phone number" },
  { id: "4", label: "Email address" },
  { id: "5", label: "Medicare number" },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Reorder Fields</Button>
        <ReorderModal
          open={open}
          onClose={() => setOpen(false)}
          title="Reorder custom fields"
          items={sampleItems}
          onReorder={(items) => console.log("New order:", items)}
        />
      </>
    );
  },
};
