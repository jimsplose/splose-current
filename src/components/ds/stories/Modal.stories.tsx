import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../Modal";
import Button from "../Button";

const meta: Meta<typeof Modal> = {
  title: "Design System/Modal",
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    title: "Create appointment",
    children: <p className="text-sm text-text-secondary">Modal content goes here.</p>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

export const NoFooter: Story = {
  args: {
    open: true,
    title: "Information",
    children: <p className="text-sm text-text-secondary">This modal has no footer.</p>,
  },
};

export const Small: Story = {
  args: {
    open: true,
    title: "Confirm",
    maxWidth: "sm",
    children: <p className="text-sm text-text-secondary">Are you sure?</p>,
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </>
    ),
  },
};
