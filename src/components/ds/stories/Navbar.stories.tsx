import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "../Navbar";
import Badge from "../Badge";
import Button from "../Button";

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    backHref: "/notes",
    title: "Progress Note",
    badge: <Badge variant="green">Final</Badge>,
    children: (
      <>
        <Button variant="secondary">Send</Button>
        <Button variant="primary">Sign &amp; lock</Button>
      </>
    ),
  },
};

export const Simple: Story = {
  args: {
    backHref: "/invoices",
    title: "Invoice #INV-0042",
  },
};
